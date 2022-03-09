import { UserEntity } from './../../models/user.entity';
import { User } from './../../models/user.interface';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    const salt: string = bcrypt.genSaltSync(10);
    const hashedPass: string = bcrypt.hash(password, salt);
    return hashedPass;
  }
  async doesUserExist(email: string): Promise<boolean> {
    const user: User = await this.userRepository.findOne({ email });
    return !!user;
  }
  generateToken(user: User): string {
    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
  async registerAccount(user: User): Promise<User> {
    try {
      const { password } = user;
      const userExists: boolean = await this.doesUserExist(user.email);
      if (userExists) {
        throw new HttpException(
          'A user has already been created with this email address',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashedPassword: string = await this.hashPassword(password);
      user.password = hashedPassword;
      this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  async login(user: User): Promise<{ token: string }> {
    try {
      const { email, password } = user;
      const userExists: boolean = await this.doesUserExist(email);
      if (!userExists) {
        throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
      }

      const userInstance: User = await this.userRepository.findOne(
        { email },
        {
          select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
        },
      );
      const isPasswordValid: boolean = await bcrypt.compare(
        password,
        userInstance.password,
      );
      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }
      return {
        token: this.generateToken(userInstance),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
