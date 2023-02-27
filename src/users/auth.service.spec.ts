import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Authentication Service', () => {
	let service: AuthService;
	let testUsersService: Partial<UsersService>;

	beforeEach(async () => {
		testUsersService = {
				find: () => Promise.resolve([]),
				create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User) 
			};

		const testModule = await Test.createTestingModule({
			providers: [AuthService, { provide: UsersService, useValue: testUsersService }]
		}).compile();

		service = testModule.get(AuthService);	
	});

	it('Creates auth service', async () => {
		expect(service).toBeDefined();
	});

	it('Creates new user', async () => {
		const user = await service.signup('test@tester.com', 'mypswrd')

		expect(user.password).not.toEqual('mypswrd');
		const [salt, hash] = user.password.split('.');
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	});

	it('Creates error when email has been taken', async (done) => {
		testUsersService.find = () => Promise.resolve([{ id: 1, email: 'adf', password: 'awoifn' } as User])
		await expect(
      service.signin('asdflkj@asdlfkj.com', 'passdflkj'),
    ).rejects.toThrow(NotFoundException);
  });
});