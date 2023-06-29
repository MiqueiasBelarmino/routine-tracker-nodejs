import { PrismaClientCon } from "../lib/prisma"
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { RefreshTokenController } from '../controllers/RefreshTokenController';

interface IUserResquest {
    name: string;
    username: string;
    password: string;
}

export class UserService {

    static prisma = PrismaClientCon;

    create = async ({ name, username, password } : IUserResquest) => {

        const userAlreadyExists = await this.isUserAlreadyCreated(username);

        if(userAlreadyExists){
            return { issues: [
                { message: "User already exists!" }
            ]}
        }

        const passwordHash = await hash(password, 10);
        const createdUser = await UserService.prisma.user.create({
            data: {
                name: name,
                username: username,
                password: passwordHash
            }
        });

        return { createdUser };
    }

    authenticate = async ({ username, password } : Partial<IUserResquest>): Promise<any> => {
       
        const userAlreadyExists = await this.isUserAlreadyCreated(username!);

        if(!userAlreadyExists){
            return { issues: [
                { message: "Incorrect user or password!" }
            ]}
        }

        const isValidUser = await compare(password!, userAlreadyExists!.password);

        if(!isValidUser){
            return { issues: [
                { message: "Incorrect user or password!" }
            ]}
        }

        const token = sign({}, process.env.JWT_KEY,{
            subject: userAlreadyExists!.id,
            expiresIn: "20s"
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

    isUserAlreadyCreated = async (username: string) =>{

        const userAlreadyExists = await UserService.prisma.user.findUnique({
            where: {
                username: username
            }
        });
        
        return userAlreadyExists;
    }

}