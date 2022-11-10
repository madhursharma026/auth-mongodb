import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [AuthModule, MongooseModule.forRoot("mongodb+srv://jigar-2005:password121@users-auth.6iy0tfs.mongodb.net/?retryWrites=true&w=majority")],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
