import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './guards/auth.guards';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  someProtectedRoute(@Req() req) { // taking request
   
    return {message: 'Accessed Resource', userId: req.userId }
  }

  getHello(): string {
    return this.appService.getHello();
  }



}
