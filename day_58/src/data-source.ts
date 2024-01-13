import "reflect-metadata"
import {DataSource} from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1312",
    database: "nodejs_ex_1",
    synchronize: true,
    logging: false,
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