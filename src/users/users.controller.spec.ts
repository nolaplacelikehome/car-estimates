import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

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
      signup: (email: string, password: string) => Promise.resolve({ id: 1, email: 't@t.com', password: 'p' } as User),
      signin: () => Promise.resolve({ id: 1, email: 't@t.com', password: 'p' } as User)
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


});