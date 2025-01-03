/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers } from 'ethers';
import { PredictionMarket } from '../../prediction-market/entities/market.entity';

export class OrderBookMarketHelper {
  private static instance: OrderBookMarketHelper;

  private constructor(private readonly provider: ethers.JsonRpcProvider) {
    if (OrderBookMarketHelper.instance) return OrderBookMarketHelper.instance;
  }

  static get(provider: ethers.JsonRpcProvider) {
    if (!OrderBookMarketHelper.instance)
      return new OrderBookMarketHelper(provider);
    return OrderBookMarketHelper.instance;
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
