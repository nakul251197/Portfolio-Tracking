import { Op } from "sequelize";
import { Portfolio } from "../models/portfolio";

export class PortfolioService { 

    public static async getPortfolio() {
        return await Portfolio.findAll({attributes: ['tickerSymbol', 'avgPrice', 'quantity'],where: { quantity: { [Op.gt]: 0 } }});
    }

    public static async getReturns() {
        let portfolio = await Portfolio.findAll({attributes: ['tickerSymbol', 'avgPrice', 'quantity'],where: { quantity: { [Op.gt]: 0 } }});
        let returns: number = 0;
        if(portfolio.length > 0) {
            for(let security of portfolio) {
                returns += ((100 - security.avgPrice) * security.quantity);
            }
            return returns;
        } else {
            return 0;
        }
    }

}