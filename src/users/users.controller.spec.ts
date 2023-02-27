import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';

describe('UsersController', () => {
  let controller: UsersController;
  let testUsersService: Partial<UsersService>;
  let testAuthService: Partial<AuthService>;

  beforeEach(async () => {
    testUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 't@t.com', password: 'p' } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'p' } as User]);
      },
    }
    testAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User)
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: testUsersService }, { provide: AuthService, useValue: testAuthService }]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return array of users', async () => {
    const users = await controller.findUsers('t@t.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('t@t.com')
  });

  it('Throws an error if user not found', async () => {
    testUsersService.findOne = () => null;
    await expect(controller.findUser('1'))
          .rejects
          .toThrow(NotFoundException);
  });

  it('Signing in modifies session and returns user', async () => {
    const session = { userId: 0 };
    const user = await controller.signInUser({ email: 't@t.com', password: 'p' }, session)
    expect(session.userId).toEqual(1);
  });
});