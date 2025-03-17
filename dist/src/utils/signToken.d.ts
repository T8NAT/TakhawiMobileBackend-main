import { User } from '@prisma/client';
export declare const generateTokens: (user: Partial<User>) => {
    accessToken: string;
    refreshToken: string;
};
