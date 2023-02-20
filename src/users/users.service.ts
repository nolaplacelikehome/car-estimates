import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
	// Tell DI need user repository
	constructor(@InjectRepository(User) private repo: Repository<User>) {}
}
