import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokeSchema } from './schemas/refresh-token.schema';
import { ResetToken, ResetTokeSchema } from './schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';

@Module({
  imports:[MongooseModule.forFeature([
    {
      name: User.name, schema:UserSchema,
    },
    {
      name: RefreshToken.name, schema:RefreshTokeSchema,
    },
    {
      name: ResetToken.name, schema:ResetTokeSchema,
    },
])
],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}