import "reflect-metadata"
import {DataSource} from "typeorm"

import "dotenv/config"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) ?? 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: false,

    ssl: {
        rejectUnauthorized: false,
    },
    entities: [
        "./src/entity/**/*.{ts,js}"
    ],
    migrations: [
        "./src/migration/**/*.{ts,js}"
    ],
    subscribers: [],

})
AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))