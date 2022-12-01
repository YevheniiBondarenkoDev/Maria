import { registerAs } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs(
  'mongodb',
  (): MongooseModuleOptions => ({
    autoIndex: true,
    uri: process.env.MONGO_CONNECTION_STRING,
  }),
);
