import {
  type SignupInput,
  type User,
  type userWithoutPassword,
  type LoginInput,
  type UpdateInput,
  Role,
} from "@/types/User.types.js";
import { sendEmail } from "../utils/emailService.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import db from "@/registration/data/db.js";
import { v4 as uuidv4 } from "uuid";
import type { SignOptions } from "jsonwebtoken";
import redis from "@/registration/data/redis-db.js";
import { serverErrorHandler } from "@/src/serverErrorHandler.js";

export function generateToken(
  user: {},
  exp: SignOptions["expiresIn"] = "15m",
  secret: string,
) {
  const token = jwt.sign(user, secret, {
    expiresIn: exp,
  });
  return token;
}

export function generateAccessToken(id: string, role: string) {
  const jti = uuidv4();

  const user = { sub: id, role, jti };

  const accessToken = generateToken(
    user,
    "15m",
    process.env.ACCESS_TOKEN_SECRET!,
  );
  return accessToken;
}

export function generateRefreshToken(id: string, role: string) {
  const jti = uuidv4();

  redis.set(`refreshToken:jti:${jti}`, "1", { ex: 604800 });
  const user = { sub: id, role, jti };
  const refreshToken = generateToken(
    user,
    "7d",
    process.env.REFRESH_TOKEN_SECRET!,
  );
  return refreshToken;
}

export async function signup(input: SignupInput): Promise<userWithoutPassword> {
  const { email, password, firstName, lastName, username } = input;
  const token = generateToken(
    { email },
    "5m",
    process.env.EMAIL_VERIFICATION_SECRET!,
  );

  const newUser: User = {
    email: email,
    password: password,
    username: username,
    todos: [],
    profile: {
      firstName: firstName,
      lastName: lastName ?? null,
      bio: null,
      isActive: true,
    },
    isVerified: false,
    verificationToken: token,
    role: Role.User,
  };

  await sendEmail(token, email);

  return await db.register(newUser);
}

export async function emailVerification(token: string): Promise<true> {
  return await db.verify(token);
}

export async function resendEmail(input: SignupInput): Promise<true> {
  const { email } = input;
  const token = generateToken(
    { email },
    "5m",
    process.env.EMAIL_VERIFICATION_SECRET!,
  );

  return await db.resendEmail(email, token);
}

export async function login(
  input: LoginInput,
): Promise<{ accessToken: string; refreshToken: string }> {
  return await db.authenticate(input);
}

export async function logout(
  refreshToken: string,
  accessToken: string | undefined,
): Promise<true> {
  try {
    const refreshTokenPayload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as JwtPayload;

    await redis.del(`refreshToken:jti:${refreshTokenPayload.jti}`);

    const accessTokenPayload = jwt.verify(
      accessToken ?? "",
      process.env.ACCESS_TOKEN_SECRET!,
    ) as JwtPayload;
    const remainingTime =
      accessTokenPayload.exp! - Math.floor(Date.now() / 1000);
    await redis.set(`accessToken:jti:${accessTokenPayload.jti}`, "1", {
      ex: remainingTime,
    });
    return true;
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return true;
    }
    throw serverErrorHandler(error);
  }
}

export async function update(id: string, input: UpdateInput) {
  return await db.update(id, input);
}

export async function newTokenGeneration(
  refreshToken: string,
): Promise<string> {
  return db.newTokenGeneration(refreshToken);
}

export async function getUsers(): Promise<userWithoutPassword[]> {
  return await db.getUsers();
}

export async function getUser(id: string): Promise<userWithoutPassword> {
  return await db.getUser(id);
}

export async function checkUserVerified(id: string): Promise<boolean> {
  return await db.checkUserVerified(id);
}

async function changeToAdmin(email: string) {
  return db.changeToAdmin(email);
}
