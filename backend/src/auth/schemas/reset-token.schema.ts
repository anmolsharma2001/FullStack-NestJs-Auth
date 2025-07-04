import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Document } from "mongoose";


@Schema({versionKey: false, timestamps: true})
export class ResetToken extends Document {

    @Prop({ required:true})
    token: string;

    @Prop({required: true, type:mongoose.Types.ObjectId})
    userId:mongoose.Types.ObjectId;  // References the user (by ObjectId) who owns this token

    @Prop({required:true})
    expiryDate: Date;
}

export const ResetTokeSchema = SchemaFactory.createForClass(ResetToken);