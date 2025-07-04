import { RefreshToken } from './schemas/refresh-token.schema';
import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-tokens.dto';
import { ChangePasswordDto } from './dtos/change-password.dtos';
import { AuthGuard } from 'src/guards/auth.guards';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')      // auth/signup
  async signUp(@Body() signupData:SignupDto ) {
     return this.authService.signUp(signupData);
  }

  @Post('login')
  async logIn(@Body() credentials: LoginDto){
    return this.authService.logIn(credentials);
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto ){
    return this.authService.refreshTokens(refreshTokenDto.refreshToken)
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
    async changePassword(
      @Body() changePasswordDto: ChangePasswordDto,
      @Req() req) 
    {
      return this.authService.changePassword(
        req.userId,
        changePasswordDto.oldPassword, 
        changePasswordDto.newPassword,
      );
    }



    // its an public api we don't apply guard here we apply guard only to change password
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
       return this.authService.forgotPassword(forgotPasswordDto.email)
    }

    @Put('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto){
        return this.authService.resetPassword(
          resetPasswordDto.newPassword,
          resetPasswordDto.resetToken
        )
    }

  }

