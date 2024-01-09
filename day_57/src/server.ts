import express, {Application} from "express"
import path from "node:path";
import routes from "./routes";
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser";
import flash from 'connect-flash';
import {authMiddleware} from "./middlewares/auth";
import session from 'express-session'

const app: Application = express();

const port = process.env.PORT ?? 3000
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

console.log(bodyParser)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    cookie: {maxAge: 60000},
    secret: 'haxinh',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
// app.use(express.cookieParser())

app.all('*', authMiddleware)

app.use(routes)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});