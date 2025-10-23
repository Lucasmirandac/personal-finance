import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { TransactionType } from '../transaction.entity';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsInt()
  @IsNotEmpty()
  categoryId!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  amountInCents!: number;

  @IsInt()
  @IsNotEmpty()
  userId!: number;

  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type!: TransactionType;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  amountInCents?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}

export class TransactionResponseDto {
  id!: number;
  title!: string;
  categoryId!: number;
  description?: string;
  amountInCents!: number;
  userId!: number;
  date!: Date;
  createdAt!: Date;
  updatedAt!: Date;
  type!: TransactionType;
}
