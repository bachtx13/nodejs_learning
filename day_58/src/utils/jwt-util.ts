import jwt from 'jsonwebtoken'
import {IJwtPayload} from "../interfaces/common/jwt-payload";

const secret = process.env.TOKEN_SECRET ?? "hacute"

const generateToken = (payload: IJwtPayload) => {
    return jwt.sign(payload, secret, {
        expiresIn: "7 days"
    })
}

const decodeToken = (token: string) => {
    return jwt.verify(token, secret);
}

export {
    generateToken,
    decodeToken
}