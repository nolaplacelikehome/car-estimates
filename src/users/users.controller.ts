import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseGuards, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service'; 
import { CurrentUser } from './decorators/current-user-decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)	
export class UsersController {
	// Another DI
	constructor(private userService: UsersService, 
							private authService: AuthService
						) {}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signup(body.email, body.password);
		session.userId = user.id
		return user;
	}

	@Post('signout')
	signout(@Session() session: any) {
		session.userId = null;
	}

	@Post('signin')
	async signInUser(@Body() body: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signin(body.email, body.password);
		session.userId = user.id
		return user;
	}

	@UseGuards(AuthGuard )
	@Get('whoami')
	whoami(@CurrentUser() user: User) {
		return user;
	}

	@Get('/:id')
	async findUser(@Param('id') id: string) {
		const user = await this.userService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}

	@Get()
	findUsers(@Query('email') email: string) {
		return this.userService.find(email);
	}

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
		return this.userService.update(parseInt(id), body);
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: string) {
		return this.userService.remove(parseInt(id));
	}
}