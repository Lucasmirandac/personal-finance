import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './models/user.dto';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(async () => {
    const mockService = {
      createUser: jest.fn(),
      findAllUsers: jest.fn(),
      findUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    mockUserService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const inputCreateUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        document: '123456789',
      };

      const expectedResult = {
        id: 1,
        email: 'test@example.com',
        document: '123456789',
      };

      mockUserService.createUser.mockResolvedValue(expectedResult);

      const actualResult = await controller.createUser(inputCreateUserDto);

      expect(mockUserService.createUser).toHaveBeenCalledWith(
        inputCreateUserDto,
      );
      expect(actualResult).toEqual(expectedResult);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        { id: 1, email: 'test1@example.com', document: '123456789' },
        { id: 2, email: 'test2@example.com', document: '987654321' },
      ];

      mockUserService.findAllUsers.mockResolvedValue(expectedUsers);

      const actualResult = await controller.findAllUsers();

      expect(mockUserService.findAllUsers).toHaveBeenCalled();
      expect(actualResult).toEqual(expectedUsers);
    });
  });

  describe('testEndpoint', () => {
    it('should return test message', async () => {
      const expectedResult = { message: 'User module is working correctly' };

      const actualResult = await controller.testEndpoint();

      expect(actualResult).toEqual(expectedResult);
    });
  });
});
