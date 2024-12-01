import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PredictionOutcome } from '../prediction-market/entities/outcome.entity';
import { ethers } from 'ethers';
import { InjectRepository } from '@nestjs/typeorm';
import { Chain } from './entities/chain.entity';
import { Repository } from 'typeorm';
import { BlockchainWallet } from './entities/blockchain-wallet.entity';
import { ConditionTokenContractData } from './contracts/ctf.contracts';
import { CryptocurrencyToken } from './entities/cryptocurrency-token.entity';
import { Oracle } from '../prediction-market/entities/oracle.entity';
import { MarketMakerFactory } from './entities/market-maker-factory.entity';
import { CryptoTokenEnum } from './enums/crypto-token.enum';
import { PredictionMarket } from '../prediction-market/entities/market.entity';
import BigNumber from 'bignumber.js';

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private operator: { wallet: BlockchainWallet; ethers: ethers.Wallet };
  private conditionalTokensContract: ethers.Contract;

  toKeccakHash(data: string) {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  }

  getChain(chainId: number) {
    return this.chainRepository.findOneBy({ id: chainId });
  }

  constructor(
    @InjectRepository(Chain)
    private readonly chainRepository: Repository<Chain>,
    @InjectRepository(BlockchainWallet)
    private readonly blockchainWalletRepository: Repository<BlockchainWallet>,
    @InjectRepository(MarketMakerFactory)
    private readonly marketMakerFactoryRepository: Repository<MarketMakerFactory>,
    @InjectRepository(CryptocurrencyToken)
    private readonly cryptocurrencyTokenRepository: Repository<CryptocurrencyToken>,
  ) {
    this.init().catch((ex) =>
      console.error('Failed to init blockchain service:', ex),
    );
  }

  async init() {
    const localTestnet = await this.getChain(1337); // TODO: Decide how to set this.
    this.provider = new ethers.JsonRpcProvider(localTestnet.rpcUrl);
    const wallet = await this.blockchainWalletRepository.findOneBy({
      userId: 0,
    }); // TODO: Modify this, and also add relations to user.
    this.operator = {
      wallet,
      ethers: new ethers.Wallet(wallet.getPrivateKey(), this.provider),
    };

    this.conditionalTokensContract = new ethers.Contract(
      ConditionTokenContractData.address,
      ConditionTokenContractData.abi,
      this.operator.ethers,
    );
  }

  get zeroAddress() {
    return '0x0000000000000000000000000000000000000000000000000000000000000000';
  }

  async getCurrentChainId() {
    return Number((await this.provider.getNetwork()).chainId);
  }

  getPrimaryAddresses(num: number, specificLength: number = 64) {
    return `0x${'0'.repeat(specificLength - num.toString().length)}${num}`;
  }

  async getDefaultMarketMaker(chainId?: number) {
    return this.marketMakerFactoryRepository.findOne({
      where: {
        chainId: chainId || (await this.getCurrentChainId()),
      },
      order: {
        id: 'ASC',
      },
    });
  }

  outcomeIndexToIndexSet(outcomeIndices: number | number[]) {
    if (!(outcomeIndices instanceof Array)) {
      return parseInt((10 ** +outcomeIndices).toString(), 2);
    }
    let value = 0;
    for (const index of outcomeIndices) {
      value += parseInt((10 ** index).toString(), 2);
    }
    return value;
  }

  getNumberOfOutcomeCollections(outcomesCount: number) {
    return 2 ** outcomesCount;
  }

  async createMarket(
    marketMakerFactoryIdentifier: number | MarketMakerFactory,
    collateralTokenSymbol: CryptoTokenEnum,
    question: string,
    outcomes: PredictionOutcome[],
    initialLiquidityInEth: number,
    oracle: Oracle,
    shouldResolveAt: Date,
  ) {
    const currentChainId = await this.getCurrentChainId();

    const [factory, collateralToken] = await Promise.all([
      marketMakerFactoryIdentifier instanceof MarketMakerFactory
        ? marketMakerFactoryIdentifier
        : this.marketMakerFactoryRepository.findOneBy({
            id: marketMakerFactoryIdentifier,
            chainId: currentChainId,
          }),
      this.cryptocurrencyTokenRepository.findOneBy({
        chainId: currentChainId, // TODO: Check this works fine?
        symbol: collateralTokenSymbol.toString(),
      }),
    ]);
    if (!factory) {
      throw new NotFoundException("This kind of AMM doesn't exist!");
    }
    if (factory.maxSupportedOutcomes < outcomes.length)
      throw new BadRequestException(
        `This AMM doesn't support more than ${factory.maxSupportedOutcomes} outcomes.`,
      );

    if (!collateralToken?.abi?.length)
      // TODO: check this works fine, too
      throw new BadRequestException(
        'Unfortunately this cryptocurrency is not supported to be used as collateral token in this network.',
      );
    const marketMakerFactoryContract = new ethers.Contract(
        factory.address,
        factory.factoryABI,
        this.operator.ethers,
      ),
      collateralTokenContract = new ethers.Contract(
        collateralToken.address,
        collateralToken.abi,
        this.operator.ethers,
      );
    const initialLiquidity = ethers.parseEther(
      initialLiquidityInEth.toString(),
    );
    const questionHash = this.toKeccakHash(question);
    const prepareConditionTx =
      await this.conditionalTokensContract.prepareCondition(
        oracle.address,
        questionHash,
        outcomes.length,
      );
    await prepareConditionTx.wait();
    console.log('Prepare condition finished, trx: ', prepareConditionTx);

    const conditionId = await this.conditionalTokensContract.getConditionId(
      oracle.address,
      questionHash,
      outcomes.length,
    );
    console.warn('Condition id = ', conditionId);

    const collateralDepositTx = await collateralTokenContract.deposit({
      value: initialLiquidity,
      nonce: await this.operator.ethers.getNonce(),
    });
    await collateralDepositTx.wait();
    console.log(
      'Collateral token deposit completed, trx:',
      collateralDepositTx,
    );

    const approveTx = await collateralTokenContract.approve(
      factory.address,
      initialLiquidity,
    );
    await approveTx.wait();
    console.warn('Liquidity deposit completed and approved.');

    let lmsrFactoryTx = await marketMakerFactoryContract.createLMSRMarketMaker(
      ConditionTokenContractData.address,
      collateralToken.address,
      [conditionId], // TODO: Maybe write another method to create multiple markets at the same time?
      0,
      '0x0000000000000000000000000000000000000000',
      initialLiquidity,
      {
        from: this.operator.ethers.address,
        nonce: await this.operator.ethers.getNonce(),
      },
    );

    lmsrFactoryTx = await lmsrFactoryTx.wait();
    console.log('LMSR Market creation finished, trx: ', lmsrFactoryTx);

    const creationLog = await this.findEventByName(
      lmsrFactoryTx,
      marketMakerFactoryContract,
      factory.marketMakerCreationEvent,
    );

    if (!creationLog[0]?.args?.[factory.marketMakerAddressField]) {
      console.error(
        'Failed to find out the created market maker contract address data: creationLog:',
        creationLog,
        'trx: ',
        JSON.stringify(lmsrFactoryTx, null, 2),
      );
      throw new ConflictException(
        'Although the market creation seems ok, but server fails to find its contract!',
      );
    }

    console.log(
      'Found MarketMaker contract address data. Blockchain processes all finished.',
    );

    return {
      conditionId: conditionId as string,
      creatorId: this.operator.wallet.userId,
      question,
      questionHash,
      marketMakerFactory: factory,
      marketMakerAddress: creationLog[0].args[factory.marketMakerAddressField],
      oracle,
      collateralToken,
      liquidity: initialLiquidity,
      prepareConditionTxHash: prepareConditionTx.hash as string,
      createMarketTxHash: lmsrFactoryTx.hash as string,
      chainId: currentChainId,
    }; // the input params are also returned, so in case any required changes happened [such as changing oracle or AMM due to some reason,
    //  or increasing/decreasing initial liquidity or whatever], market entity data would be correct.
  }

  async findEventByName(
    transactionReceipt: ethers.ContractTransactionReceipt,
    contract: ethers.Contract,
    eventName: string,
  ): Promise<ethers.LogDescription[]> {
    try {
      // Get the event fragment from the contract's interface
      const eventFragment = contract.interface.getEvent(eventName);

      // Generate the topics for the event
      const eventTopics = contract.interface.encodeFilterTopics(
        eventFragment,
        [],
      );

      const logs = transactionReceipt.logs.filter(
        (log) => log.topics[0] === eventTopics[0], // Compare the event signature topic
      );

      // Decode and return the matching logs
      return logs.map((log) => contract.interface.parseLog(log));
    } catch (error) {
      console.error('Error finding event by name:', error);
      throw error;
    }
  }

  getCollectionId(
    conditionId: string,
    possibleOutcomeIndices: number | number[],
    parentCollectionId: string | null = null,
  ) {
    return this.conditionalTokensContract.getCollectionId(
      parentCollectionId || this.zeroAddress,
      conditionId,
      this.outcomeIndexToIndexSet(possibleOutcomeIndices),
    );
  }

  getCollectionIdByIndexSetValue(
    conditionId: string,
    indexSetValue: number,
    parentCollectionId: string | null = null,
  ) {
    return this.conditionalTokensContract.getCollectionId(
      parentCollectionId || this.zeroAddress,
      conditionId,
      indexSetValue,
    );
  }

  getOutcomeSlotsCount(conditionId: string) {
    return this.conditionalTokensContract.getOutcomeSlotCount(conditionId);
  }

  async getPositionId(
    collateralToken: CryptocurrencyToken,
    collectionId: string,
  ) {
    return this.conditionalTokensContract.getPositionId(
      collateralToken.address,
      collectionId,
    );
  }

  async validateMarketCreation(
    conditionId: string,
    marketOutcomesCount: number = 2,
  ) {
    return (
      Number(await this.getOutcomeSlotsCount(conditionId)) ===
      marketOutcomesCount
    ); // As gnosis docs says, this is the proper way to validate the market creation operation, after calling prepareCondition.
  }

  alreadyOwnsWallet(userId: number) {
    return this.blockchainWalletRepository.findOneBy({ userId });
  }

  async createBlockchainWallet(ownerId: number, publicKey?: string) {
    // TODO: do some checks
    if (await this.alreadyOwnsWallet(ownerId))
      throw new ConflictException('This user already has a blockchain wallet.');
    if (!publicKey) {
      // FIXME:  Create or assign a blockchain wallet to this user and set the public/private key values then
    }
    return this.blockchainWalletRepository.save(
      this.blockchainWalletRepository.create({
        name: 'user',
        publicKey,
        secret: null,
        userId: ownerId,
      }),
    );
  }

  async getBlockchainWallet(userId: number) {
    const wallet = await this.blockchainWalletRepository.findOne({
      where: { userId },
    });
    if (!wallet) return this.createBlockchainWallet(userId);
    return wallet;
  }

  async trade(
    traderId: number,
    market: PredictionMarket,
    selectedOutcomeIndex: number,
    amount: number,
  ) {
    const traderWallet = await this.getBlockchainWallet(traderId);
    const tradersEthersWallet = new ethers.Wallet(
      traderWallet.secret,
      this.provider,
    );
    const marketMakerContract = new ethers.Contract(
      market.address,
      market.ammFactory.marketMakerABI,
      tradersEthersWallet,
    );
    const collateralTokenContract = new ethers.Contract(
      market.collateralToken.address,
      market.collateralToken.abi,
      tradersEthersWallet,
    );
    console.log('weth9 decimals: ', await collateralTokenContract.decimals());
    const formattedAmount = new BigNumber(Math.abs(amount)).multipliedBy(
      Math.pow(10, Number(await collateralTokenContract.decimals())),
    );
    return amount > 0
      ? this.buyOutcomeToken(
          traderWallet.publicKey,
          market,
          BigInt(formattedAmount.toString()),
          selectedOutcomeIndex,
          marketMakerContract,
          collateralTokenContract,
        )
      : this.sellOutcomeToken(
          traderWallet.publicKey,
          tradersEthersWallet,
          market,
          BigInt(formattedAmount.toString()),
          selectedOutcomeIndex,
          marketMakerContract,
        );
  }

  async buyOutcomeToken(
    buyerAddress: string,
    market: PredictionMarket,
    formattedAmount: bigint,
    selectedOutcomeIndex: number,
    marketMakerContract: ethers.Contract,
    collateralTokenContract: ethers.Contract,
  ) {
    const outcomeTokenAmounts = Array.from(
      { length: market.numberOfOutcomes },
      (_: unknown, index: number) =>
        index === selectedOutcomeIndex ? formattedAmount : 0n,
    );

    const [cost, collateralBalance] = (
      await Promise.all([
        marketMakerContract.calcNetCost(outcomeTokenAmounts),
        collateralTokenContract.balanceOf(buyerAddress),
      ])
    ).map((x) => BigInt(x));
    // FIXME: 'calcNetCost' method is only for lmsr, fpmm contract has separate methods for buy and sell

    console.log('Buy cost is: ', cost);
    console.log('User collateral Balance: ', collateralBalance);

    if (cost > collateralBalance) {
      // If user does not have enough collateral, deposit ETH from their wallet to gain collateral.
      const collateralDepositTx = await collateralTokenContract.deposit({
        value: (cost - collateralBalance).toString(),
      });
      await collateralDepositTx.wait();

      const approveTx = await collateralTokenContract.approve(
        market.address,
        formattedAmount.toString(),
      );
      await approveTx.wait();
      console.warn(
        'New user balance after supporting deposit: ',
        await collateralTokenContract.balanceOf(buyerAddress),
      );

      // FIXME: What if user does not have enough ETH to deposit for collateral
    }
    // checkout wether such amount of token exists to be bought or not of not provide by operator.
    return marketMakerContract.trade(outcomeTokenAmounts, cost);
  }

  async sellOutcomeToken(
    sellerAddress: string,
    sellerEthersWallet: ethers.Wallet,
    market: PredictionMarket,
    formattedAmount: bigint,
    selectedOutcomeIndex: number,
    marketMakerContract: ethers.Contract,
  ) {
    const conditionalTokensContract = new ethers.Contract(
      ConditionTokenContractData.address,
      ConditionTokenContractData.abi,
      sellerEthersWallet,
    );
    // TODO:  Checkout if user has such amount of selected tokens to sell ot noy
    const isApproved = await conditionalTokensContract.isApprovedForAll(
      sellerAddress,
      market.address,
    );
    if (!isApproved) {
      await conditionalTokensContract.setApprovalForAll(market.address, true, {
        nonce: await sellerEthersWallet.getNonce(),
      });
    }

    const outcomeTokenAmounts = Array.from(
      { length: market.numberOfOutcomes },
      (_: unknown, index: number) =>
        index === selectedOutcomeIndex ? -formattedAmount : 0n,
    );
    const profit =
      -(await marketMakerContract.calcNetCost(outcomeTokenAmounts));

    // FIXME: this method is only for lmsr, fpmm contract has separate methods for buy and sell
    return marketMakerContract.trade(outcomeTokenAmounts, profit);
  }

  async getUserConditionalTokenBalance(
    userId: number,
    market: PredictionMarket,
    indexSet: number,
  ) {
    const userBlockchainWallet = await this.getBlockchainWallet(userId);
    const collectionId = await this.getCollectionId(
      market.conditionId,
      indexSet,
    );
    if (!collectionId) throw new NotFoundException('Invalid outcome!');
    const collateralTokenContract = new ethers.Contract(
      market.collateralToken.address,
      market.collateralToken.abi,
      this.operator.ethers,
    );
    const [positionId, ctDecimals] = await Promise.all([
      this.getPositionId(market.collateralToken, collectionId),
      collateralTokenContract.decimals(), // TODO: Based on gnosis, this CT decimals equals to its collateral token decimals (?)
    ]);
    if (!positionId)
      throw new ConflictException(
        'Something went wrong while calculating balance',
      );
    const balanceWei = new BigNumber(
      await this.conditionalTokensContract.balanceOf(
        userBlockchainWallet.publicKey,
        positionId,
      ),
    );
    console.log('balance (wei):', balanceWei, 'dec:', ctDecimals);
    return balanceWei.div(Math.pow(10, Number(ctDecimals)));
  }

  async getBlocksTransactions(blockNumber: number) {
    const block = await this.provider.getBlock(blockNumber);

    return {
      blockNumber: block.number,
      blockHash: block.hash,
      timestamp: block.timestamp,
      // or other block data
      transactions: await Promise.all(
        block.transactions.map(async (txHash) => {
          const { hash, from, to, value, ...extra } =
            await this.provider.getTransaction(txHash);
          return {
            hash,
            from,
            to,
            amount: ethers.formatEther(value),
            extra,
          };
        }),
      ),
    };
  }

  async getLatestBlock() {
    const latestBlockNumber = await this.provider.getBlockNumber();
    return this.getBlocksTransactions(latestBlockNumber);
  }
}
