import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { Payload } from '../types/payloadType';

const signToken = (payload: Payload, sekretKey: string, expiresIn: string) =>
  jwt.sign(payload, sekretKey, { expiresIn });

export const generateTokens = (user: Partial<User>) => {
  const payload = { id: user.uuid!, role: user.role! };
  const accessToken: string = signToken(
    payload,
    process.env.SECRET_KEY_ACCESSTOKEN!,
    process.env.EXPIRE_ACCESS_TOKEN!,
  );
  const refreshToken: string = signToken(
    payload,
    process.env.SECRET_KEY_REFRESHTOKEN!,
    process.env.EXPIRE_REFRESH_TOKEN!,
  );
  return { accessToken, refreshToken };
};
