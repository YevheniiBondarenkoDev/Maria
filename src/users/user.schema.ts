import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RolesEnum } from './helpers/constants';
import { Roles } from './helpers/types';

@Schema()
export class User {
  @Prop()
  name?: string;
  @Prop()
  surname?: number;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ enum: RolesEnum, required: true })
  role: Roles;
  @Prop({ required: true })
  password: string;
  @Prop()
  sessionToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
