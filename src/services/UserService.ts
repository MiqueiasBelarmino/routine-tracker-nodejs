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
        const plainPassword = CryptoJS.AES.decrypt(password!,process.env.AES_SECRET as string).toString(CryptoJS.enc.Utf8);
        const passwordHash = await hash(plainPassword, 10);
        const createdUser = await UserService.prisma.user.create({
            data: {
                name: name,
                username: username,
                password: passwordHash
            }
        });

        return { createdUser: { id:createdUser.id, name: createdUser.name } };
    }

    authenticate = async ({ username, password }: Partial<IUserResquest>): Promise<any> => {

        const plainPassword = CryptoJS.AES.decrypt(password!,process.env.AES_SECRET as string).toString(CryptoJS.enc.Utf8);
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

    loadSession = async (token: string) => {

        return verify(token, process.env.JWT_KEY as string, async (err, decoded) => {
            if (err) {
                return { error: true, status: 401, message: 'Invalid/Expired session' }
            }

            let user = await UserService.prisma.user.findUnique({
                where: {
                    id: decoded?.sub?.toString()
                }
            });

            return {
                token,
                user: {
                    id: user?.id,
                    name: user?.name,
                }
            }
        })
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