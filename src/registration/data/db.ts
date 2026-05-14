import { UserModel } from "./UserSchema.js";
import {
  Role,
  type LoginInput,
  type UpdateInput,
  type User,
  type userWithoutPassword,
} from "@/types/User.types.js";
import { sendEmail } from "@/registration/utils/emailService.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
} from "@/registration/services/authService.js";
import { serverErrorHandler } from "@/src/serverErrorHandler.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import redis from "@/registration/data/redis-db.js";

class UserDB {
  async register(newUser: User): Promise<userWithoutPassword> {
    try {
      const user = await UserModel.create(newUser);
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async update(id: string, input: UpdateInput): Promise<userWithoutPassword> {
    try {
      const user = await UserModel.findById(id);

      if (!user) {
        throw {
          status: 404,
          field: null,
          message: "The user was not found",
          isManual: true,
        };
      }

      const { firstName, lastName, username, bio } = input;

      if (firstName) {
        user.profile.firstName = firstName;
      }
      if (lastName) {
        user.profile.lastName = lastName;
      }
      if (username) {
        user.username = username;
      }
      if (bio) {
        user.profile.bio = bio;
      }

      const { password, ...userWithoutPassword } = user.toObject();
      await user.save();

      return userWithoutPassword;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async verify(token: string): Promise<true> {
    try {
      const payload = jwt.verify(
        token,
        process.env.EMAIL_VERIFICATION_SECRET!,
      ) as JwtPayload;

      const user = await UserModel.findOne({ email: payload.email });

      if (!user) {
        throw {
          status: 400,
          field: null,
          message: "The verification link is expired or invalid",
          isManual: true,
        };
      }

      user.verificationToken = null;
      user.isVerified = true;

      await user.save();
      return true;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async newTokenGeneration(refreshToken: string): Promise<string> {
    try {
      if (!refreshToken) {
        throw {
          status: 401,
          field: null,
          message: "The refresh token was not provided",
          isManual: true,
        };
      }

      const refreshTokenPayload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN!,
      ) as JwtPayload;

      if (!redis.get(`refreshToken:jti:${refreshTokenPayload.jti}`)) {
        throw {
          status: 401,
          field: null,
          message: "The refresh token is no longer available",
          isManual: true,
        };
      }

      const accessToken = generateAccessToken(
        refreshTokenPayload.sub!,
        refreshTokenPayload.role,
      );

      return accessToken;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async resendEmail(email: string, token: string): Promise<true> {
    try {
      const user = await UserModel.findOne({ email: email });

      if (!user) {
        throw {
          status: 404,
          field: "email",
          message: "The user with this email was not found",
          isManual: true,
        };
      }

      user.verificationToken = token;
      await user.save();
      await sendEmail(token, email);
      return true;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async changeToAdmin(email: string): Promise<userWithoutPassword | null> {
    try {
      const user = await UserModel.findOne({ email: email }).select(
        "-password",
      );
      if (user) {
        user.role = Role.Admin;
      }
      return user;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async authenticate(
    input: LoginInput,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { email, username, password } = input;
      let user;

      if (email) {
        user = await UserModel.findOne({ email: email });
      }

      if (username) {
        user = await UserModel.findOne({ username: username });
      }

      if (!user) {
        throw {
          status: 400,
          field: null,
          message: "The email or password is incorrect",
          isManual: true,
        };
      }

      if (!user.isVerified) {
        throw {
          status: 403,
          field: null,
          message: "The user has not verified his account yet",
          isManual: true,
        };
      }

      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);
        return { accessToken, refreshToken };
      } else {
        throw {
          status: 400,
          field: null,
          messsage: "The email or password is incorrect",
          isManual: true,
        };
      }
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async checkUserVerified(id: string): Promise<boolean> {
    try {
      const user = await UserModel.findById(id);

      if (!user || !user.isVerified) {
        return false;
      }

      return true;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async getUser(id: string): Promise<userWithoutPassword> {
    try {
      const user = (await UserModel.findById(id).select(
        "-password",
      )) as userWithoutPassword;

      return user;
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }

  async getUsers(): Promise<userWithoutPassword[]> {
    try {
      return await UserModel.find({});
    } catch (error) {
      throw serverErrorHandler(error);
    }
  }
}

export default new UserDB();
