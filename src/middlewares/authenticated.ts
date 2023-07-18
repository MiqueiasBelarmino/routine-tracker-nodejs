import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export function authenticated(request: Request, response: Response, next: NextFunction){

    const authToken = request.headers.authorization;

    if(!authToken){
        return response.status(401).json({
            error: true,
            message: "Token is missing!"
        });
    }

    const [,token] = authToken.split(" ");

    try {
        verify(token, process.env.JWT_KEY);
        return next();
    } catch (error) {
        return response.status(401).json({
            error: true,
            message: "Token is invalid!"
        });
    }

}