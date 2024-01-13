import express from "express"
import bodyParser from "body-parser"

import {AppDataSource} from "./data-source"
import route from "./routes";
import path from "node:path";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import authMiddleware from "./middleware/auth-middleware";
import httpContext from 'express-http-context'
import useragent from 'express-useragent'

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(session({
        cookie: {maxAge: 60000},
        secret: 'haxinh',
        resave: false,
        saveUninitialized: false
    }));
    app.use(bodyParser.json())

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug')

    app.use(flash());
    app.use(useragent.express());
    app.use(httpContext.middleware);
    app.all('*', authMiddleware)
    app.use(route);
    // start express server
    const _PORT = process.env.PORT ?? 3000
    app.listen(_PORT, () => {
        console.log(`Express server has started on port ${_PORT}. Open http://localhost:${_PORT}`)
    })

}).catch(error => console.log(error))
