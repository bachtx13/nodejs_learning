import express from "express"
import bodyParser from "body-parser"

import {AppDataSource} from "./data-source"
import route from "./routes";
import path from "node:path";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import httpContext from 'express-http-context'
import useragent from 'express-useragent'
import "dotenv/config"
import passport from "passport";
import {jwtStrategy} from "./config/passport";

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express()
    app.use(express.static("public"))
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(session({
        cookie: {maxAge: 60000},
        secret: 'haxinh',
        resave: false,
        saveUninitialized: false
    }));
    app.use(bodyParser.json())
    app.use(passport.initialize())

    app.set('views', path.join(process.cwd(), 'src/views'));
    app.set('view engine', 'pug')

    app.use(flash());
    app.use(useragent.express());
    app.use(httpContext.middleware);
    passport.use(jwtStrategy)
    // app.all('*', authMiddleware)
    app.use(route);
    // start express server
    const _PORT = process.env.PORT ?? 3000
    app.listen(_PORT, () => {
        console.log(`Express server has started on port ${_PORT}. Open http://localhost:${_PORT}`)
    })

}).catch(error => console.log(error))
