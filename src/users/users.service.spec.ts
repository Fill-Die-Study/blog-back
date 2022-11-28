import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { number, object } from 'joi';
import { emit } from 'process';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const mockUserRepo = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockToken = 'token!';

const mockJwtService = {
  sign: jest.fn(() => mockToken),
  verify: jest.fn(),
};

type MockRepository<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let jwtService: JwtService;

  const mockUser = ({ email = 'mock@mock.com', password = 'mock' }) => ({
    id: 0,
    email,
    password,
    role: 0,
    posts: [],
    createAt: '2022-11-28T04:47:50.457Z',
    deleteAt: '2022-11-28T04:47:50.457Z',
    updateAt: '2022-11-28T04:47:50.457Z',
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo(),
        },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  it('User Service가 존재한다.', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers: 전체 유저조회 테스트', () => {
    it('error가 catch되지 않으면 유저 조회를 성공한다.', async () => {
      // mocking return values
      usersRepository.find.mockResolvedValue([mockUser({}), mockUser({})]);

      // call service func
      const result = await service.getAllUsers();

      // expect
      expect(usersRepository.find).toBeCalledTimes(1);
      expect(result).toMatchObject({
        success: true,
        users: [mockUser({}), mockUser({})],
      });
    });

    it('error exception이 일어날 시 실패한다.', async () => {
      // mocking return values
      usersRepository.find.mockRejectedValue(new Error());

      // call service func
      const result = await service.getAllUsers();

      // expect
      expect(result.success).toBe(false);
    });
  });

  describe('getUserById: id 유저조회 테스트', () => {
    it('해당 id를 가진 유저가 존재하지 않을 시 실패한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue(undefined);

      // call service func
      const result = await service.getUserById(0);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(result).toMatchObject({
        success: false,
        error: '해당 사용자를 찾을 수 없습니다.',
      });
    });

    it('해당 id를 가진 유저가 존재할 시 성공적으로 조회한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue(mockUser({}));

      // call service func
      const result = await service.getUserById(0);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(result).toMatchObject({
        success: true,
        user: mockUser({}),
      });
    });

    it('error를 catch 할 시 실패한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockRejectedValue(new Error());

      // call service func
      const result = await service.getUserById(0);

      // expect

      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(result.success).toBe(false);
    });
  });

  describe('createUser: 유저생성 테스트', () => {
    const createUserArgs = {
      email: '',
      password: '',
      role: 0,
    };

    it('이미 해당 email을 가진 유저가 있다면 실패한다.', async () => {
      usersRepository.findOneBy.mockResolvedValue(
        mockUser({ email: '', password: '' }),
      );

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

  describe('updateUser: 유저수정 테스트', () => {
    const updateUserArgs = {
      email: 'mock2@mock2.com',
      password: 'mock2',
    };

    const oldUser = mockUser({});
    const newUser = { ...oldUser, ...updateUserArgs };

    it('해당 id를 가진 user가 존재하지 않을 시 실패한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue(undefined);

      // call service func
      const result = await service.updateUser(0, updateUserArgs);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(result).toMatchObject({
        success: false,
        error: '유저를 찾을 수 없습니다.',
      });
    });

    it('해당 id를 가진 user가 존재할 시 성공한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue(oldUser);
      usersRepository.save.mockResolvedValue({
        ...oldUser,
        ...updateUserArgs,
      });

      // call service func
      const result = await service.updateUser(0, updateUserArgs);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      // point!
      expect(usersRepository.save).toBeCalledWith(newUser);
      expect(result).toMatchObject({
        success: true,
      });
    });

    it('error exception이 일어날 시 실패한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockRejectedValue(new Error());

      // call service func
      const result = await service.updateUser(0, updateUserArgs);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(result.success).toBe(false);
    });
  });

  describe('deleteUser: 유저제거 테스트', () => {
    it('error exception이 일어나지 않으면 성공한다.', async () => {
      // mocking return values
      usersRepository.delete.mockResolvedValue({});

      // call service func
      const result = await service.deleteUser('mock@mock.com');

      // expect
      expect(usersRepository.delete).toBeCalledTimes(1);
      expect(result).toMatchObject({ success: true });
    });

    it('error exception이 일어나면 실패한다.', async () => {
      // mocking return values
      usersRepository.delete.mockRejectedValue(new Error());

      // call service func
      const result = await service.deleteUser('mock@mock.com');

      // expect
      expect(usersRepository.delete).toBeCalledTimes(1);
      expect(result.success).toBe(false);
    });
  });

  describe('login: 로그인 테스트', () => {
    const loginArgs: LoginDto = {
      email: 'mock@mock.com',
      password: 'mock',
    };

    it('email을 가진 유저가 없다면 실패한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue(undefined);

      // call login
      const result = await service.login(loginArgs);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(usersRepository.findOneBy).toBeCalledWith(expect.any(Object));
      expect(result).toMatchObject({
        success: false,
        error: 'Email을 정확히 입력해주세요.',
      });
    });

    it('password가 올바르지 않으면 실패한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue({
        ...mockUser({ password: 'mock2' }),
        comparePassword: jest.fn(() => Promise.resolve(false)),
      });

      // call login
      const result = await service.login(loginArgs);

      // expect
      expect(result).toMatchObject({
        success: false,
        error: '비밀번호가 올바르지 않습니다.',
      });
    });

    it('유저가 존재하고 password가 일치하면 token이 발급된다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockResolvedValue({
        ...mockUser({}),
        comparePassword: jest.fn(() => Promise.resolve(true)),
      });

      // call login
      const result = await service.login(loginArgs);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(jwtService.sign).toBeCalledWith(expect.any(Object));
      expect(result).toMatchObject({
        success: true,
        token: mockToken,
      });
    });

    it('login 진행 중 error가 catch 될 시 실패한다.', async () => {
      // mocking return values
      usersRepository.findOneBy.mockRejectedValue(new Error('error!'));

      // call login
      const result = await service.login(loginArgs);

      // expect
      expect(usersRepository.findOneBy).toBeCalledTimes(1);
      expect(result.success).toBe(false);
    });
  });
});
