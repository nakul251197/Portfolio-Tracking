import { logger } from "../util/logger";
import HttpException from "../exception/HttpException";
import { Portfolio } from "../models/portfolio";
import { Trade } from "../models/trade";
import { Action } from "../util/typings";

export class TradesService {

    public static async createTrade(trade: Trade) {
        logger.info("TradesService: Entering createTrade");
        trade.tickerSymbol = trade.tickerSymbol.trim();
        if(trade.quantity % 1 != 0)  throw new HttpException(404, `Quantity should be a whole number`, 'InputException');
        let portfolio: Portfolio | null = await Portfolio.findOne({ where: { tickerSymbol: trade.tickerSymbol } });
        let newTrade = null;
        if (trade.action === Action.BUY) {
            trade.createdOn = new Date();
            newTrade = await Trade.create(trade);
            if (!portfolio) {
                let newPortfolioItem = {
                    tickerSymbol: trade.tickerSymbol,
                    avgPrice: trade.price,
                    quantity: trade.quantity
                }
                await Portfolio.create(newPortfolioItem);
            } else {
                await TradesService.addBuyTradeToPortfolio(portfolio, newTrade);
            }
            return newTrade;
        } else if (trade.action === Action.SELL) {
            if (!portfolio) {
                throw new HttpException(400, `Insufficient quantity of ${trade.tickerSymbol} in portfolio`, 'OrderException');
            } else {
                if ((portfolio.quantity - trade.quantity) >= 0) {
                    trade.createdOn = new Date();
                    newTrade = await Trade.create(trade);
                    await TradesService.addSellTradeToPortfolio(portfolio, newTrade);
                    return newTrade;
                } else {
                    throw new HttpException(400, `Insufficient quantity of ${trade.tickerSymbol} in portfolio`, 'OrderException');
                }
            }
        }
        logger.info("TradesService: Exiting createTrade");
    }

    public static async removeTrade(id: number) {
        logger.info("TradesService: Entering removeTrade");
        let trade = await Trade.findOne({where: {id: id, deletedOn: null}});
        if(!trade) throw new HttpException(404, `No order found with id: ${id}`, 'OrderException');
        else {
            let portfolio = await Portfolio.findOne({ where: { tickerSymbol: trade.tickerSymbol } });
            if(!portfolio) throw new HttpException(400, `No ${trade.tickerSymbol} in portfolio`, 'OrderException');
            if(portfolio && trade.action === Action.BUY && (portfolio.quantity - trade.quantity < 0))
                throw new HttpException(400, `Insufficient quantity of ${trade.tickerSymbol} in portfolio`, 'OrderException');
            await TradesService.revertingTradefromPortfolio(trade, portfolio);
            trade.deletedOn = new Date();
            logger.info("TradesService: Exiting removeTrade");
            return await trade.save();
        }
    }

    public static async updateTrade(id: number, trade: Trade) {
        logger.info("TradesService: Entering updateTrade");
        if(trade.quantity % 1 != 0)  throw new HttpException(404, `Quantity should be a whole number`, 'InputException');
        trade.tickerSymbol = trade.tickerSymbol.trim();
        let existingTrade = await Trade.findOne({where: {id: id, deletedOn: null}});
        if(!existingTrade) throw new HttpException(404, `No order found with id: ${id}`, 'OrderException');
        else {
            if(existingTrade.tickerSymbol !== trade.tickerSymbol || (existingTrade.action !== trade.action && existingTrade.tickerSymbol === trade.tickerSymbol)) {
                let existingPortfolio = await Portfolio.findOne({ where: { tickerSymbol: existingTrade.tickerSymbol } });
                if(!existingPortfolio) throw new HttpException(400, `No ${existingTrade.tickerSymbol} in portfolio`, 'OrderException');
                if(existingPortfolio && existingTrade.action === Action.BUY && (existingPortfolio.quantity - existingTrade.quantity < 0))
                    throw new HttpException(400, `Insufficient quantity of ${trade.tickerSymbol} in portfolio`, 'OrderException');
                await TradesService.revertingTradefromPortfolio(existingTrade, existingPortfolio);
                let newPortfolio = await Portfolio.findOne({ where: { tickerSymbol: trade.tickerSymbol } }); 
                if(trade.action === Action.BUY) {
                    if (!newPortfolio) {
                        let newPortfolioItem = {
                            tickerSymbol: trade.tickerSymbol,
                            avgPrice: trade.price,
                            quantity: trade.quantity
                        }
                        await Portfolio.create(newPortfolioItem);
                    } else {
                        await TradesService.addBuyTradeToPortfolio(newPortfolio, trade);
                    }
                } else {
                    if(!newPortfolio) throw new HttpException(400, `No ${trade.tickerSymbol} in portfolio`, 'OrderException'); 
                    if(newPortfolio.quantity - trade.quantity >= 0) {
                        await TradesService.addSellTradeToPortfolio(newPortfolio, trade);
                    } else {
                        existingPortfolio = await Portfolio.findOne({ where: { tickerSymbol: existingTrade.tickerSymbol } });
                        if(!existingPortfolio) throw new HttpException(400, `No ${existingTrade.tickerSymbol} in portfolio`, 'OrderException');
                        if(existingTrade.action === Action.BUY) await TradesService.addBuyTradeToPortfolio(existingPortfolio, existingTrade);
                        else await TradesService.addSellTradeToPortfolio(existingPortfolio, existingTrade);
                        throw new HttpException(400, `Insufficient quantity of ${trade.tickerSymbol} in portfolio`, 'OrderException');
                    }
                }
            } else {
                const securityDiff = trade.quantity - existingTrade.quantity;
                let existingPortfolio = await Portfolio.findOne({ where: { tickerSymbol: existingTrade.tickerSymbol } });
                if(!existingPortfolio) throw new HttpException(400, `No ${existingTrade.tickerSymbol} in portfolio`, 'OrderException');
                if(trade.action === Action.BUY) {
                    if(securityDiff < 0 && existingPortfolio.quantity - trade.quantity < 0)
                        throw new HttpException(400, `Insufficient quantity of ${trade.tickerSymbol} in portfolio`, 'OrderException');
                    let temp = existingPortfolio.quantity - existingTrade.quantity;
                    let avgPrice = ((existingPortfolio.avgPrice * existingPortfolio.quantity) - (existingTrade.price * existingTrade.quantity))/(temp) || 0;
                    avgPrice = ((avgPrice * temp) + (trade.price * trade.quantity)) / (temp + trade.quantity);
                    existingPortfolio.avgPrice = avgPrice;
                    if(securityDiff > 0) {
                        existingPortfolio.quantity = existingPortfolio.quantity + securityDiff;
                    } else {
                        existingPortfolio.quantity = existingPortfolio.quantity - Math.abs(securityDiff);
                    }
                    if(existingPortfolio.quantity == 0) existingPortfolio.avgPrice =0;
                    await existingPortfolio.save();
                } else {
                    if(securityDiff < 0 && existingPortfolio.quantity - trade.quantity < 0)
                        throw new HttpException(400, `Insufficient quantity of ${trade.tickerSymbol} in portfolio`, 'OrderException');
                        if(securityDiff < 0) {
                            existingPortfolio.quantity = existingPortfolio.quantity + Math.abs(securityDiff);
                        } else {
                            existingPortfolio.quantity = existingPortfolio.quantity - securityDiff;
                        }
                        if(existingPortfolio.quantity == 0) existingPortfolio.avgPrice =0;
                        await existingPortfolio.save();
                }
            }
            existingTrade.tickerSymbol = trade.tickerSymbol;
            existingTrade.price = trade.price;
            existingTrade.quantity = trade.quantity;
            existingTrade.action = trade.action;
            existingTrade.updatedOn = new Date();
            return await existingTrade.save();
        }
    }

    public static async getTrades() {
        logger.info("TradesService: Entering getTrades");
        let trades = await Trade.findAll({where: {deletedOn: null}});
        const map = new Map();
        let list = [];
        for(let trade of trades) {
            let obj = {
                quantity: trade.quantity,
                price: trade.price,
                action: trade.action
            }
            if(map.has(trade.tickerSymbol)) {
                let arr = map.get(trade.tickerSymbol);
                arr.push(obj);
                map.set(trade.tickerSymbol, arr);
            } else {
                map.set(trade.tickerSymbol, [obj]);
            }
        }
        for (const [key, value] of map.entries()) {
            console.log(value);
            list.push({tickerSymbol: key, trades: value});
          }
          logger.info("TradesService: Exiting getTrades");
          return list;
    }

    private static async addBuyTradeToPortfolio(portfolio: Portfolio, trade: Trade) {
        logger.info("TradesService: Entering addBuyTradeToPortfolio");
        let portfolioTotalPrice: number = portfolio.quantity * portfolio.avgPrice;
        let tradeTotalPrice: number = trade.quantity * trade.price;
        let currentTotalShares: number = trade.quantity + portfolio.quantity;
        let currentAverage: number = (portfolioTotalPrice + tradeTotalPrice) / (currentTotalShares);
        await Portfolio.update({ avgPrice: currentAverage, quantity: currentTotalShares }, { where: { id: portfolio.id } });
        logger.info("TradesService: Exiting addBuyTradeToPortfolio");
    }

    private static async addSellTradeToPortfolio(portfolio: Portfolio, trade: Trade) {
        logger.info("TradesService: Entering addSellTradeToPortfolio");
        let currentTotalShares: number = portfolio.quantity - trade.quantity;
        if(currentTotalShares == 0) await Portfolio.update({ quantity: currentTotalShares, avgPrice: 0 }, { where: { id: portfolio.id } });
        await Portfolio.update({ quantity: currentTotalShares }, { where: { id: portfolio.id } });
        logger.info("TradesService: Exiting addSellTradeToPortfolio");
    }

    private static async revertingTradefromPortfolio(trade: Trade, portfolio: Portfolio) {
        logger.info("TradesService: Entering revertingTradefromPortfolio");
        let currentAverage: number = 0;
        if(trade.action === Action.BUY) {
            let portfolioTotalPrice: number = portfolio.quantity * portfolio.avgPrice;
            let tradeTotalPrice: number = trade.quantity * trade.price;
            let currentTotalShares: number = portfolio.quantity - trade.quantity;
            if(currentTotalShares == 0) {
                currentAverage = 0;   
            } else {
                currentAverage = (portfolioTotalPrice - tradeTotalPrice) / (currentTotalShares) || 0;
            }
            await Portfolio.update({ avgPrice: currentAverage, quantity: currentTotalShares }, { where: { id: portfolio.id } });
        } else {
            await Portfolio.update({ quantity: (portfolio.quantity + trade.quantity)}, { where: { id: portfolio.id } });
        }
        logger.info("TradesService: Exiting revertingTradefromPortfolio");
    }
}