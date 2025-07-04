import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { ref } from 'node:process';
import { nanoid } from 'nanoid';
import { MailService } from 'src/services/mail.service';
import { ResetToken } from './schemas/reset-token.schema';
const { v4: uuidv4 } = require('uuid');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
     @InjectModel(ResetToken.name) private ResetTokenModel : Model<ResetToken>,
    
    private JwtService: JwtService,
    private mailservice: MailService,
  ) {}



  async signUp(signupData: SignupDto) {
    // extracted all fields of signupData to not to write like signupData.email or name or password directly can use
    const { email, password, name } = signupData;

    // Check if email is in use below code
    const emailInUse = await this.UserModel.findOne({
      // email: signupData.email,
      email,
    });
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    // Hash Password below code
    const hashPassword = await bcrypt.hash(password, 10); // await to wait till hassing is completed
    // The 10 is called the salt rounds When bcrypt hashes a password, it uses a technique called salting and hashing.The 10 means bcrypt will perform 10 rounds of processing on the password.More rounds = more secure, but also more CPU time needed.


    
    // create user document and save it in mongodb
    const createdUser = await this.UserModel.create({
      name,
      email,
      // ...signupData,
      password: hashPassword, // override plain password
    });     
    
    return createdUser;
  }



  async logIn(credentials: LoginDto) {
    // same like signup we take fields of login dto to use
    const { email, password } = credentials;

    // Find if user exists by email
    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('wrong credentials');
    }


    // Compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('wrong credentials');
    }



    // return this.generateUsersTokens(user._id);



    const tokens = await this.generateUsersTokens(user._id);

    return {
      // ...tokens,
      message: 'Login successful',
      name: user.name,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,  
      userId: user._id,
    }

  }

  async refreshTokens(refreshToken: string){
    
      const token = await this.RefreshTokenModel.findOne({
        token: refreshToken,
        expiryDate: {$gte: new Date()}, // expiry date should be greater than now's date
      });

      // send to login screen to login again to get fresh tokens 
      if(!token){
        throw new UnauthorizedException("Refresh Token is invalid");
      }

      return this.generateUsersTokens(token.userId); // we have stored user is so we can right token.userId
  }

  // Generate JWT tokens
  async generateUsersTokens(userId) {

    const accessToken = this.JwtService.sign({userId}, {expiresIn: '10h'}); // whenever we got token usinh userId we can know which token belongs to which user
     
    // refresh token 
    
    const refreshToken = uuidv4(); // This generate refresh token 

    // to save refresh token 
    await this.storeRefreshToken(refreshToken, userId);

    return {
        accessToken,
        refreshToken,
    }
  }


  // function to store or save refresh token in database
  async storeRefreshToken(token: string, userId){
    
    // Calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); // added 3 days pm current date so our refresh token expires in 3 days 

    await this.RefreshTokenModel.updateOne(
      {userId }, 
      {$set: {expiryDate, token}}, 
    {
        upsert:true,
    },
  )

  }


  async changePassword(userId, oldPassword: string, newPassword: string){

    // Find the user
     const user = await this.UserModel.findById(userId);
     if(!user){
      throw new NotFoundException('User not found...');
     }

    // Compare the old password with the password in DB
     const passwordMatch = await bcrypt.compare(oldPassword, user.password);
     if (!passwordMatch) {
      throw new UnauthorizedException('wrong credentials');
    }

    // Change user's password (DON'T FORGET TO HASH IT )
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    
    // save new password 
    user.password = newHashedPassword;
    await user.save();


  }

  // async forgotPassword(email:string){
  //   //Check that user exists 

  //   // If user exists, generate password reset link

  //   // Send the link to the user by email (using nodemailer/ SES / etc...)

  // }

   async forgotPassword(email:string){
     // Check that user exists 
     const user = await this.UserModel.findOne({email})

     if(user){
     // If User exists, generate password link
      const resetToken = nanoid(64);


       // save this token in database
       const expiryDate = new Date();
       expiryDate.setHours(expiryDate.getHours() + 1); // 

       await this.ResetTokenModel.create({
         token : resetToken,
         userId: user._id,
         expiryDate,
       })



     // Send the link to the user by email (using nodemailer/ SES / etc..)
     this.mailservice.sendPasswordResetEmail(email, resetToken);

     }

     return {
      message : "If this user exists, they will receive an email"
     };

  }


  async resetPassword(newPassword:string, resetToken: string){
    // Find a valid reset token document 
    const token = await this.ResetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    // Change user password (Make sure to HASH)
    const user = await this.UserModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return{
      message: "Password reset succesfully"
    }

  }



}



