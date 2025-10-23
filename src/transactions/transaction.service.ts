import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionResponseDto,
} from './models/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: createTransactionDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createTransactionDto.userId} not found`,
      );
    }

    const category = await this.categoryRepository.findOne({
      where: { id: createTransactionDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createTransactionDto.categoryId} not found`,
      );
    }

    const transaction = this.transactionRepository.create({
      title: createTransactionDto.title,
      category: category,
      description: createTransactionDto.description,
      amountInCents: createTransactionDto.amountInCents,
      user: user,
      date: new Date(createTransactionDto.date),
      type: createTransactionDto.type,
    });

    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.mapToResponseDto(savedTransaction);
  }

  async findAllTransactions(): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      relations: ['user', 'category'],
    });
    return transactions.map((transaction) =>
      this.mapToResponseDto(transaction),
    );
  }

  async findTransactionById(id: number): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return this.mapToResponseDto(transaction);
  }

  async findTransactionsByUserId(
    userId: number,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'category'],
    });
    return transactions.map((transaction) =>
      this.mapToResponseDto(transaction),
    );
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    if (updateTransactionDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateTransactionDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateTransactionDto.userId} not found`,
        );
      }
    }

    if (updateTransactionDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateTransactionDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateTransactionDto.categoryId} not found`,
        );
      }
    }

    const updateData: any = { ...updateTransactionDto };
    if (updateTransactionDto.date) {
      updateData.date = new Date(updateTransactionDto.date);
    }

    Object.assign(transaction, updateData);
    const savedTransaction = await this.transactionRepository.save(transaction);
    return this.mapToResponseDto(savedTransaction);
  }

  async deleteTransaction(id: number): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    await this.transactionRepository.remove(transaction);
  }

  async getTransactionSummary(userId: number): Promise<{
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
  }> {
    const transactions = await this.transactionRepository.find({
      where: { user: { id: userId } },
    });

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amountInCents, 0);

    const totalExpense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amountInCents, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }

  private mapToResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      title: transaction.title,
      categoryId: transaction.category.id,
      description: transaction.description,
      amountInCents: transaction.amountInCents,
      userId: transaction.user.id,
      date: transaction.date,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      type: transaction.type,
    };
  }
}
