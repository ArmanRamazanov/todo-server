import { type PopulatedDoc } from "mongoose";
import { type Todo } from "./Todo.types.js";
import mongoose from "mongoose";

export enum Role {
  Admin = "admin",
  User = "user",
}

export enum Status {
  Active = "active",
  Inactive = "inactive",
}

export interface User {
  username: string;
  password: string;
  email: string;
  role: Role;
  todos: PopulatedDoc<Todo>[] | mongoose.Types.ObjectId[];
  profile: {
    firstName: string;
    lastName: string | null;
    bio: string | null;
    isActive: boolean;
  };
  isVerified: boolean;
  verificationToken: string | null;
}

export type userWithoutPassword = Omit<User, "password">;

export type SignupInput = Omit<
  User,
  "profile" | "isVerified" | "verificationToken" | "role"
> & {
  firstName: string;
  lastName?: string;
};

export type LoginInput = Pick<User, "email" | "password" | "username">;

export type UpdateInput = Partial<
  Omit<
    User,
    | "password"
    | "email"
    | "role"
    | "profile"
    | "isVerified"
    | "verificationToken"
  > & {
    firstName: string;
    lastName: string;
    bio: string;
  }
>;
