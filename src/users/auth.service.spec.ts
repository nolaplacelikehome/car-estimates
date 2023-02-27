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

	it('Creates error if email in use', async () => {
		await service.signup('test@test.com', 'asdfasdfnv')
	});
});