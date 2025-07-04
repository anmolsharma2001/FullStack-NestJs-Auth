import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import {Request} from 'express';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private JwtService: JwtService) {}
    canActivate(context: ExecutionContext,
     
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request); 

        if(!token) {
            // return false; //Forbidden 403 
            throw new UnauthorizedException('Invalid token');
        }

        try {
            // verify token 
        const payload = this.JwtService.verify(token);
        request.userId = payload.userId; // we get user id on request object
        }catch(e){
            Logger.error(e.message);
            throw new UnauthorizedException("Invalid Token");
        }
         return true;
        
    }

    // method which takes request and checks header 
    // we find authorization and split the value and than take first index
    private extractTokenFromHeader(request: Request): string | undefined {
       return request.headers.authorization?.split(' ')[1];
    }

}