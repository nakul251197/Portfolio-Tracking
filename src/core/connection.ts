import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = require('../config/config');
let sequelize: Sequelize;

if(env === "production") {
    let connectString: any =  sequelizeConfig.production.connectString;
    sequelize = new Sequelize(connectString, {dialect: "mysql"});
} else {
    let connectString: any =  sequelizeConfig.development.connectString;
    sequelize = new Sequelize(connectString, {dialect: "mysql"});
} 

export {sequelize};