import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Authentication Service', () => {
	let service: AuthService;
	let testUsersService: Partial<UsersService>;

	beforeEach(async () => {
		const users: User[] = [];
		testUsersService = {
				find: (email: string) => {
					const filteredUsers = users.filter((user) => user.email === email);
					return Promise.resolve(filteredUsers);
				},
				create: (email: string, password: string) => {
					const user = { id: Math.floor(Math.random() * 999999), email, password, } as User;
					users.push(user);
					return Promise.resolve(user);
				}
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
		const user = await service.signup('test@tester.com', 'mypswrd');

		expect(user.password).not.toEqual('mypswrd');
		const [salt, hash] = user.password.split('.');
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	});

	it('Creates error if email in use', async () => {
		await service.signup('t2@t2.com', 'p');
		await expect(service.signup('t2@t2.com', 'p'))
					.rejects
					.toThrow(BadRequestException)
	});

	it('Creates error if sign in with unused email', async () => {
		await expect(service.signin('t@t.com', 'p'))
					.rejects
					.toThrow(NotFoundException)
	});

	it('Creates error when given invalid password', async () => {
		await service.signup('t1@t1.com', 'password');
		await expect(service.signin('t1@t1.com', 'notp'))
					.rejects
					.toThrow(BadRequestException)
	});

	it('Returns user on correct password', async () => {
		await service.signup('t@t.com', 'p');

		const user = await service.signin('t@t.com', 'p');
		expect(user).toBeDefined();
		
	});
});