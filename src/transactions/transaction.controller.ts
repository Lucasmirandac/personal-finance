import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
} from './models/transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get()
  async findAllTransactions(
    @Query('userId') userId?: number,
  ): Promise<TransactionResponseDto[]> {
    if (userId) {
      return this.transactionService.findTransactionsByUserId(userId);
    }
    return this.transactionService.findAllTransactions();
  }

  @Get('summary/:userId')
  async getTransactionSummary(@Param('userId', ParseIntPipe) userId: number) {
    return this.transactionService.getTransactionSummary(userId);
  }

  @Get(':id')
  async findTransactionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.findTransactionById(id);
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.updateTransaction(id, updateTransactionDto);
  }

  @Delete(':id')
  async deleteTransaction(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.transactionService.deleteTransaction(id);
  }

  @Get('admin/test')
  async testEndpoint(): Promise<{ message: string }> {
    return { message: 'Transaction module is working correctly' };
  }
}
