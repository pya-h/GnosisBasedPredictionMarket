import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePredictionMarketDto {
  @ApiProperty({
    description: 'The Question',
  })
  @IsNotEmpty({ message: 'Question can not be empty' })
  question: string;

  @ApiProperty({
    description: 'Duration in which the league is open in seconds',
    isArray: true,
  })
  @IsArray({ message: 'This field must be an array of outcome texts.' })
  @ArrayMinSize(2, { message: 'At least two outcomes are expected.' })
  @IsString({ each: true, message: 'You must enter outcome values.' })
  outcomes: string[];

  @ApiProperty({
    description:
      'The category of the market, specifying which topic is market question about. null means General',
  })
  @IsNotEmpty({ message: 'The id of the market question category.' })
  @IsInt({ message: 'Category Id must be a positive integer!' })
  @IsPositive({ message: 'Category Id must be a positive integer!' })
  categoryId: number;

  @ApiProperty({
    description:
      'The starting liquidity, specifying the initial amount of collateral token which is going to be invested on the market. This also specifies the initial price of outcomes.',
  })
  @IsNotEmpty({ message: 'Initial liquidity of the market must be specified.' })
  @IsNumber()
  @IsPositive()
  initialLiquidity: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: 'Closing date of the market.',
    required: true,
  })
  resolveAt: Date;

  @ApiPropertyOptional({
    description: 'The Question',
    required: false,
    default: null,
  })
  @IsOptional({
    message:
      'The subject of the question, an abbreviation for the market question indeed.',
  })
  subject?: string;
}
