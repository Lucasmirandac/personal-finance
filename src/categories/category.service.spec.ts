import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './models/category.dto';
import { NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockRepository: jest.Mocked<Repository<Category>>;

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
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    mockRepository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const inputCreateCategoryDto: CreateCategoryDto = {
        name: 'Food',
      };

      const expectedCategory = {
        id: 1,
        name: 'Food',
      };

      mockRepository.create.mockReturnValue(expectedCategory as Category);
      mockRepository.save.mockResolvedValue(expectedCategory as Category);

      const actualResult = await service.createCategory(inputCreateCategoryDto);

      expect(mockRepository.create).toHaveBeenCalledWith(
        inputCreateCategoryDto,
      );
      expect(mockRepository.save).toHaveBeenCalled();
      expect(actualResult.name).toBe(inputCreateCategoryDto.name);
    });
  });

  describe('findCategoryById', () => {
    it('should return category when found', async () => {
      const inputId = 1;
      const mockCategory = {
        id: 1,
        name: 'Food',
      };

      mockRepository.findOne.mockResolvedValue(mockCategory as Category);

      const actualResult = await service.findCategoryById(inputId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: inputId },
      });
      expect(actualResult.id).toBe(inputId);
    });

    it('should throw NotFoundException when category not found', async () => {
      const inputId = 999;
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findCategoryById(inputId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
