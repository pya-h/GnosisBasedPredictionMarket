import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PredictionMarketService } from './prediction-market.service';
import { CreatePredictionMarketDto } from './dto/create-market.dto';
import { GetMarketsQuery } from './dto/get-markets.dto';
import { TradeCoditionalToken } from './dto/trade-ctf.dto';

@Controller('binary-prediction')
export class PredictionMarketController {
  constructor(
    private readonly predictionMarketService: PredictionMarketService,
  ) {}

  @Post()
  createNewMarket(
    @Body()
    {
      question,
      initialLiquidity,
      outcomes,
      resolveAt,
      categoryId = null,
      subject = null,
    }: CreatePredictionMarketDto,
  ) {
    return this.predictionMarketService.createNewMarket(
      question,
      outcomes,
      initialLiquidity,
      resolveAt,
      categoryId,
      subject,
    );
  }

  @Get()
  getMarkets(@Query() marketFeatures?: GetMarketsQuery) {
    return this.predictionMarketService.findMarkets(marketFeatures);
  }

  @Get(':id')
  getSpecificMarket(@Param('id', ParseIntPipe) id: string) {
    return this.predictionMarketService.getMarket(+id);
  }

  // TODO: Patch endpoint

  // TODO: Delete endpoint (softDelete actually)

  @Post('buy-ctf')
  buyOutcomeToken(@Body() tradeTokenDto: TradeCoditionalToken) {
    // TODO: add currentuser decorator and the curren user address
    return this.predictionMarketService.trade({...tradeTokenDto, traderId: 0});
  }

  @Post('sell-ctf')
  sellOutcomeToken(@Body() tradeTokenDto: TradeCoditionalToken) {
    tradeTokenDto.amount *= -1;
    return this.predictionMarketService.trade({...tradeTokenDto, traderId: 0});
  }
}
