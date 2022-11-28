import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUserRepo = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be', () => {
    expect(service).toBeDefined();
  });

  describe('createUser: 유저생성 테스트', () => {
    const createUserArgs = {
      email: '',
      password: '',
      role: 0,
    };

    it('이미 해당 email을 가진 유저가 있다면 실패한다.', async () => {
      usersRepository.findOneBy.mockResolvedValue({
        id: 0,
        email: 'mock@mock.com',
        password: 'mock',
        role: 0,
        posts: [],
        createAt: '2022-11-28T04:47:50.457Z',
        deleteAt: '2022-11-28T04:47:50.457Z',
        updateAt: '2022-11-28T04:47:50.457Z',
      });

      const result = await service.createUser(createUserArgs);

      expect(result).toMatchObject({
        success: false,
        error: '이미 같은 이메일은 가진 사용자가 존재합니다.',
      });
    });

    it('이미 해당 email을 가진 유저가 없다면 성공한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createUserArgs);

      // call createUser
      const result = await service.createUser(createUserArgs);

      // expect functions and value
      expect(usersRepository.create).toBeCalledTimes(1);
      expect(usersRepository.create).toBeCalledWith(createUserArgs);

      expect(usersRepository.save).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledWith(createUserArgs);

      expect(result.success).toBe(true);
    });

    it('repository의 함수에서 에러가 나면 실패한다.', async () => {
      usersRepository.findOneBy.mockRejectedValue(new Error('Async Error!'));

      const result = await service.createUser(createUserArgs);

      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });
  it.todo('getUserById');
  it.todo('createUser');
  it.todo('updateUser');
  it.todo('login');
});
