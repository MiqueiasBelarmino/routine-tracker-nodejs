import { PrismaClientCon } from "../lib/prisma"
import { addDays, dateToMidnightISODate, generateTokenJWT} from "../utils/helpers";

export class RefreshTokenController {

    generate = async (userId: string) => {

        await PrismaClientCon.refreshToken.deleteMany({
            where: {
                 userId: userId
            }
        });

        const generatedRefreshToken = await PrismaClientCon.refreshToken.create({
            data: {
                userId: userId,
                expiresIn: addDays(dateToMidnightISODate(), 15).getTime()
            }
        });

        return { id: generatedRefreshToken.id, userId: generatedRefreshToken.userId, expiresIn: generatedRefreshToken.expiresIn.toString()};
    }

    refresh = async (refresh_token: string) => {

        const refreshToken = await PrismaClientCon.refreshToken.findUnique({
            where: {
                id: refresh_token
            }
        });

        if(!refreshToken){
            return { issues: [
                { message: "Refresh token is invalid!" }
            ]}
        }

        const token = await generateTokenJWT(refreshToken.userId);

        return { token }
    }
}