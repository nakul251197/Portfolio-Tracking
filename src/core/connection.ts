import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
import envConfig from "../config/config.json";

let config: any = envConfig.development;
let sequelize: Sequelize = new Sequelize(config.database, config.username, config.password, config);

export {sequelize};