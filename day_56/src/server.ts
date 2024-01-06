import express, {Application} from "express"
import path from "node:path";
import routes from "./routes";
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser";

const app: Application = express();

const port = process.env.PORT ?? 3000
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

console.log(bodyParser)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// app.use(express.cookieParser())

app.use(routes)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});