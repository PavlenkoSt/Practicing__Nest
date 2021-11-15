import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import UserRole from 'src/types/UserRole';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  password: string;

  @Prop()
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
