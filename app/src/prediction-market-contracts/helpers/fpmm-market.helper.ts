/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { PredictionMarket } from '../../prediction-market/entities/market.entity';

export class FixedProductMarketHelper {
  private static instance: FixedProductMarketHelper;

  private constructor(private readonly provider: ethers.JsonRpcProvider) {
    if (FixedProductMarketHelper.instance)
      return FixedProductMarketHelper.instance;
  }

  static get(provider: ethers.JsonRpcProvider) {
    if (!FixedProductMarketHelper.instance)
      return new FixedProductMarketHelper(provider);
    return FixedProductMarketHelper.instance;
  }

  async buyOutcomeToken(
    buyerAddress: string,
    market: PredictionMarket,
    formattedAmount: bigint,
    selectedOutcomeIndex: number,
    marketMakerContract: ethers.Contract,
    collateralTokenContract: ethers.Contract,
  ) {}

  async sellOutcomeToken(
    sellerAddress: string,
    sellerEthersWallet: ethers.Wallet,
    market: PredictionMarket,
    formattedAmount: bigint,
    selectedOutcomeIndex: number,
    marketMakerContract: ethers.Contract,
  ) {}

  async getTokenPrice(market: PredictionMarket, outcomeIndex: number) {}
}
