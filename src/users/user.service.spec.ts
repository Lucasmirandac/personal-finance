import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './models/user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const mockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const inputCreateUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        document: '123456789',
        fullname: 'Test User',
      };

      const expectedUser = {
        id: 1,
        email: 'test@example.com',
        document: '123456789',
        fullname: 'Test User',
        password: 'hashedPassword',
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(expectedUser as User);
      mockRepository.save.mockResolvedValue(expectedUser as User);

      const actualResult = await service.createUser(inputCreateUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: [
          { email: inputCreateUserDto.email },
          { document: inputCreateUserDto.document },
        ],
      });
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
      expect(actualResult.email).toBe(inputCreateUserDto.email);
    });

    it('should throw ConflictException when user already exists', async () => {
      const inputCreateUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        document: '123456789',
      };

      const existingUser = { id: 1, email: 'test@example.com' };

      mockRepository.findOne.mockResolvedValue(existingUser as User);

      await expect(service.createUser(inputCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return user when found', async () => {
      const inputId = 1;
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        document: '123456789',
      };

      mockRepository.findOne.mockResolvedValue(mockUser as User);

      const actualResult = await service.findUserById(inputId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: inputId },
      });
      expect(actualResult.id).toBe(inputId);
    });

    it('should throw NotFoundException when user not found', async () => {
      const inputId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findUserById(inputId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
