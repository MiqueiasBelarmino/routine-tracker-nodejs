import { PrismaClientCon } from "../lib/prisma"
import { addDays, dateToMidnightISODate, generateTokenJWT} from "../utils/helpers";

export class RefreshTokenController {

    generate = async (userId: string) => {

        await PrismaClientCon.refreshToken.deleteMany({
            where: {
                 user_id: userId
            }
        });

        const generatedRefreshToken = await PrismaClientCon.refreshToken.create({
            data: {
                user_id: userId,
                expires_in: addDays(dateToMidnightISODate(), 15).getTime()
            }
        });

        return { id: generatedRefreshToken.id, user_id: generatedRefreshToken.user_id, expires_in: generatedRefreshToken.expires_in.toString()};
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

        const token = await generateTokenJWT(refreshToken.user_id);

        return { token }
    }
}