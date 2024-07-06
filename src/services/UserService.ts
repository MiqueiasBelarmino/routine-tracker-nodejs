import { PrismaClientCon } from "../lib/prisma"
import { compare, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { RefreshTokenController } from '../controllers/RefreshTokenController';
import CryptoJS from 'crypto-js';

interface IUserResquest {
    name: string;
    username: string;
    password: string;
}

interface Session {
    token: string;
    user: {
        id: string;
        name: string;
    };
    error?: boolean;
    status?: number;
    message?: string;
}

export class UserService {

    static prisma = PrismaClientCon;

    create = async ({ name, username, password }: IUserResquest) => {

        const userAlreadyExists = await this.isUserAlreadyCreated(username);

        if (userAlreadyExists) {
            return {
                issues: [
                    { message: "User already exists!" }
                ]
            }
        }

        const passwordHash = await hash(password, 10);
        const createdUser = await UserService.prisma.user.create({
            data: {
                name: name,
                username: username,
                password: passwordHash
            }
        });

        return { createdUser: { id: createdUser.id, name: createdUser.name } };
    }

    authenticate = async ({ username, password }: Partial<IUserResquest>): Promise<any> => {

        const plainPassword = CryptoJS.AES.decrypt(password!, process.env.AES_SECRET as string).toString(CryptoJS.enc.Utf8);
        const userAlreadyExists = await this.isUserAlreadyCreated(username!);

        if (!userAlreadyExists) {
            return {
                issues: [
                    { message: "Incorrect user or password!" }
                ]
            }
        }

        const isValidUser = await compare(plainPassword, userAlreadyExists!.password);

        if (!isValidUser) {
            return {
                issues: [
                    { message: "Incorrect user or password!" }
                ]
            }
        }

        const token = sign({}, process.env.JWT_KEY as string, {
            subject: userAlreadyExists!.id,
            expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME as string
        });

        let refreshToken = null;
        try {
            refreshToken = await new RefreshTokenController().generate(userAlreadyExists.id);
        } catch (error) {

        }

        const response = {
            token,
            refreshToken
        };

        return response;
    }

    static async loadSession(token: string): Promise<Session> {
        return new Promise((resolve, reject) => {
            verify(token, process.env.JWT_KEY as string, async (err, decoded) => {
                if (err) {
                    throw new Error('Invalid/Expired session');
                }

                try {
                    const user = await UserService.prisma.user.findUnique({
                        where: {
                            id: decoded?.sub?.toString()
                        }
                    });

                    if (!user) {
                        throw new Error('User not found');
                    }

                    resolve({
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    isUserAlreadyCreated = async (username: string) => {

        const userAlreadyExists = await UserService.prisma.user.findUnique({
            where: {
                username: username
            }
        });

        return userAlreadyExists;
    }

}