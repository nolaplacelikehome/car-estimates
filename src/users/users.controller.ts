import { Body, Controller, Post, Get, Patch, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';


@Controller('auth')
export class UsersController {
	// Another DI
	constructor(private userService: UsersService) {}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		this.userService.create(body.email, body.password);
	}

	@Get('/:id')
	findUser(@Param('id') id: string) {
		this.userService.findOne(parseInt(id));
	}
}
