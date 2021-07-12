import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || 'development';
import sequelizeConfig from "../config/config.json"
let sequelize: Sequelize;

// if(env === "production") {
    let connectString: any =  sequelizeConfig.production.use_env_variable;
    sequelize = new Sequelize(connectString, {dialect: "mysql"});
// } else {
//     let connectString: any =  sequelizeConfig.development.connectString;
//     sequelize = new Sequelize(connectString, {dialect: "mysql"});
// } 

export {sequelize};