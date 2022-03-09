import { RolesGuard } from './guards/roles.guard';
import { JwtStratagy } from './guards/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { UserEntity } from './models/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, JwtStratagy, RolesGuard],
})
export class AuthModule {}
