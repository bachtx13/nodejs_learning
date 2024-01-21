import {Strategy as JwtStrategy, StrategyOptions} from 'passport-jwt'
import {AuthService} from "../services/AuthService";
import {Request} from "express";

import "dotenv/config"
import {getTokenFromCookies} from "../utils/http-util";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";

const extractJwtFromRequest = (request: unknown) => {
    let token = null
    if (request && (<Request>request).cookies) {
        token = getTokenFromCookies(request as Request)
    }
    return token
}
const jwtStrategyOpts = <StrategyOptions>{
    jwtFromRequest: extractJwtFromRequest,
    secretOrKey: process.env.TOKEN_SECRET,
    jsonWebTokenOptions: {},
    passReqToCallback: true
}


const authService = new AuthService()
const jwtStrategy = (new JwtStrategy(jwtStrategyOpts, authService.authUser))

const googleStrategy = (new GoogleStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: "",

}, () => {
}))

export {jwtStrategy}