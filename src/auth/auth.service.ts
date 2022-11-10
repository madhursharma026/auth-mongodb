import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Users } from './user.entity';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose'
import { Injectable, HttpException, HttpStatus, ConflictException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(@InjectModel('Users') private readonly usersModel: Model<Users>,
    private jwt: JwtService) { }

  async signup(email: string, password: string, name: string) {
    let user;
    try {
      user = await this.usersModel.findOne({ email }).exec();
    } catch (error) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const newUser = new this.usersModel({ email: email, password: hash, name: name })
      return await newUser.save();
    }
    if (user) {
      throw new ConflictException(`User with email: ${email} exists!`);
    } else {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const newUser = new this.usersModel({ email: email, password: hash, name: name })
      return await newUser.save();
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const foundUser = await this.usersModel.findOne({ where: { email } });
    if (foundUser) {
      if (await bcrypt.compare(password, foundUser.password)) {
        const { password, ...result } = foundUser;
        return result;
      }
      return null;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwt.sign(payload),
      "userId": user._doc._id,
      "email": user._doc.email,
      "name": user._doc.name,
      "role": user._doc.role,
      "acc_status": user._doc.acc_status
    };
  }

  async getSingleUser(userId: string) {
    const user = await this.findUser(userId)
    // return user
    return {
      "userId": user._id,
      "email": user.email,
      "name": user.name,
      "role": user.role,
      "acc_status": user.acc_status
    };
  }

  async updateUser(userId: string, email: string, name: string,) {
    const updatedUser = await this.findUser(userId);
    if (email) {
      updatedUser.email = email;
    }
    if (name) {
      updatedUser.name = name;
    }
    updatedUser.save();
    return {
      "userId": updatedUser._id,
      "email": updatedUser.email,
      "name": updatedUser.name,
      "role": updatedUser.role,
      "acc_status": updatedUser.acc_status,
      "statusCode": 200,
      "message": "User Update Successfully!"
    };
  }

  async deleteUser(userId: string) {
    const deleteUser = await this.findUser(userId);
    deleteUser.acc_status = "delete";
    deleteUser.save();
    return {
      "statusCode": 200,
      "message": "Account Deleted Successfully!"
    };
  }

  async getUsers() {
    const users = await this.usersModel.find().exec();
    // return users as Users[];
    return users.map((users) => ({ id: users.id, email: users.email, name: users.name, role: users.role, acc_status: users.acc_status }))
  }

  async deleteUserByAdmin(userId: string) {
    const deleteUser = await this.findUser(userId);
    deleteUser.acc_status = "suspend";
    deleteUser.save();
    return {
      "statusCode": 200,
      "message": "Account Deleted Successfully!"
    };
  }



  private async findUser(id: string): Promise<Users> {
    let user;
    try {
      user = await this.usersModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException(`User Not Found With id: ${id}`);
    }
    if (user.acc_status === "active") {
      // return { id: user.id, email: user.email, password: user.password, name: user.name }
      return user;
    } else {
      throw new NotFoundException(`Account has been deleted or suspended by admin`);
    }
  }
}

