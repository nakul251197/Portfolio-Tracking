import { Sequelize } from "sequelize";
const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = require('../config/config');
let sequelize: Sequelize;

if(env == "production") {
    let connectString: any =  sequelizeConfig.production.connectString;
    sequelize = new Sequelize(connectString);
} else {
    sequelize = new Sequelize(sequelizeConfig.development.database, sequelizeConfig.development.username, sequelizeConfig.development.password, sequelizeConfig.development);
} 

export {sequelize};