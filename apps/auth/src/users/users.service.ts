import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import * as bcrypt from 'bcrypt';
  import { UsersRepository } from './users.repository';
  import { CreateUserRequest } from './dto/create-user.request';
  import { User } from './schemas/user.schema';
  
  @Injectable()
  export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}
  
    async createUser(request: CreateUserRequest) {
      await this.validateCreateUserRequest(request);
      const user = await this.usersRepository.create({
        ...request,
        password: await bcrypt.hash(request.password, 10),
      });
      return user;
    }
  
    private async validateCreateUserRequest(request: CreateUserRequest) {
      let user: User | null = null; // Initialize user to null
      try {
        user = await this.usersRepository.findOne({
          email: request.email,
        });
      } catch (err) {
        if (err instanceof NotFoundException) {
          // If the error is a NotFoundException, it means the user does not exist, which is expected
          user = null;
        } else {
          // If it's another type of error, rethrow it
          throw err;
        }
      }
    
      if (user) {
        throw new UnprocessableEntityException('Email already exists.');
      }
    }
  
    async validateUser(email: string, password: string) {
      const user = await this.usersRepository.findOne({ email });
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (!passwordIsValid) {
        throw new UnauthorizedException('Credentials are not valid.');
      }
      return user;
    }
  
    async getUser(getUserArgs: Partial<User>) {
      return this.usersRepository.findOne(getUserArgs);
    }
  }