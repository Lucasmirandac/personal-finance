import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './transaction.entity';
import { User } from '../users/user.entity';
import { Category } from '../categories/category.entity';
import { CreateTransactionDto } from './models/transaction.dto';
import { NotFoundException } from '@nestjs/common';

describe('TransactionService', () => {
  let service: TransactionService;
  let mockTransactionRepository: jest.Mocked<Repository<Transaction>>;
  let mockUserRepository: jest.Mocked<Repository<User>>;
  let mockCategoryRepository: jest.Mocked<Repository<Category>>;

  beforeEach(async () => {
    const mockTransactionRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const mockUserRepo = {
      findOne: jest.fn(),
    };

    const mockCategoryRepo = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    mockTransactionRepository = module.get(getRepositoryToken(Transaction));
    mockUserRepository = module.get(getRepositoryToken(User));
    mockCategoryRepository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const inputCreateTransactionDto: CreateTransactionDto = {
        title: 'Grocery Shopping',
        categoryId: 1,
        description: 'Weekly groceries',
        amountInCents: 5000,
        userId: 1,
        date: '2024-01-01',
        type: TransactionType.EXPENSE,
      };

      const mockUser = { id: 1, email: 'test@example.com' };
      const mockCategory = { id: 1, name: 'Food' };
      const expectedTransaction = {
        id: 1,
        title: 'Grocery Shopping',
        category: mockCategory,
        user: mockUser,
        amountInCents: 5000,
        type: TransactionType.EXPENSE,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser as User);
      mockCategoryRepository.findOne.mockResolvedValue(
        mockCategory as Category,
      );
      mockTransactionRepository.create.mockReturnValue(
        expectedTransaction as Transaction,
      );
      mockTransactionRepository.save.mockResolvedValue(
        expectedTransaction as Transaction,
      );

      const actualResult = await service.createTransaction(
        inputCreateTransactionDto,
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: inputCreateTransactionDto.userId },
      });
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: inputCreateTransactionDto.categoryId },
      });
      expect(mockTransactionRepository.create).toHaveBeenCalled();
      expect(mockTransactionRepository.save).toHaveBeenCalled();
      expect(actualResult.title).toBe(inputCreateTransactionDto.title);
    });

    it('should throw NotFoundException when user not found', async () => {
      const inputCreateTransactionDto: CreateTransactionDto = {
        title: 'Grocery Shopping',
        categoryId: 1,
        amountInCents: 5000,
        userId: 999,
        date: '2024-01-01',
        type: TransactionType.EXPENSE,
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createTransaction(inputCreateTransactionDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTransactionSummary', () => {
    it('should calculate transaction summary correctly', async () => {
      const inputUserId = 1;
      const mockTransactions = [
        { type: TransactionType.INCOME, amountInCents: 10000 },
        { type: TransactionType.EXPENSE, amountInCents: 3000 },
        { type: TransactionType.EXPENSE, amountInCents: 2000 },
      ];

      mockTransactionRepository.find.mockResolvedValue(
        mockTransactions as Transaction[],
      );

      const actualResult = await service.getTransactionSummary(inputUserId);

      expect(actualResult.totalIncome).toBe(10000);
      expect(actualResult.totalExpense).toBe(5000);
      expect(actualResult.balance).toBe(5000);
      expect(actualResult.transactionCount).toBe(3);
    });
  });
});
