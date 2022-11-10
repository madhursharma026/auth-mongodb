// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   email: string;

//   @Column()
//   password: string;

//   @CreateDateColumn()
//   createdAt: string;

//   @UpdateDateColumn()
//   updtedAt: string;
// }


// export class User {}
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    acc_status: { type: String, required: true, default: 'active' },
})

export interface Users extends mongoose.Document {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    acc_status: string;
}