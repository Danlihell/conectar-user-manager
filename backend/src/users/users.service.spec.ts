import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });


  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with a hashed password', async () => {
      const createUserDto = { name: 'New User', email: 'new@user.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';

      const userToBeCreated = { ...createUserDto, password: hashedPassword };
      const savedUser = { id: 'some-uuid', role: UserRole.USER, ...userToBeCreated };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);


      mockUserRepository.create.mockReturnValue(userToBeCreated);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(repository.create).toHaveBeenCalledWith(userToBeCreated);
      expect(repository.save).toHaveBeenCalledWith(userToBeCreated);
      expect(result).toEqual(savedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('some-uuid');
      expect(repository.delete).toHaveBeenCalledWith('some-uuid');
    });

    it('should throw NotFoundException if user to delete is not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('non-existent-uuid')).rejects.toThrow(NotFoundException);
    });
  });
});