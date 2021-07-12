import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || 'development';
import sequelizeConfig from "../config/config.json"
let sequelize: Sequelize;

if(env === "production") {
    let connectString: any =  sequelizeConfig.production.use_env_variable || process.env.CLEARDB_DATABASE_URL;
    sequelize = new Sequelize(connectString, {dialect: "mysql"});
} else {
    let config: any =  sequelizeConfig.development || process.env.CLEARDB_DATABASE_URL;
    sequelize = new Sequelize(config.database, config.username, config.password, config);
} 

export {sequelize};