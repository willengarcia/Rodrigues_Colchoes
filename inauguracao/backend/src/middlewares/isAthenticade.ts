import {configDotenv} from 'dotenv'
import { Request, Response, NextFunction } from 'express'
import {verify} from 'jsonwebtoken';
interface Payload {
    sub: string
}
export function isAuthenticated(req:Request, res:Response, next:NextFunction){
    // receber token
    const authToken = req.headers.authorization
    if(!authToken){
        return res.status(401).end() // barrando o usuário
    }
    const [, token] = authToken.split(' ')
    try{
        const {sub} = verify(token, process.env.JWT_SECRET as string) as Payload
        req.user_id = sub
        return next()
    }catch(err){
        return res.status(401).end()
    }
}