import { Model, STRING, DATE, DOUBLE } from "sequelize";
import { Action } from "../util/typings";
import { sequelize } from "../core/connection";

export class Trade extends Model {
  id!: number;
  tickerSymbol!: string;
  action!: Action;
  price!: number;
  quantity!: number;
  createdOn?: Date;
  updatedOn?: Date;
  deletedOn?: Date;
}

Trade.init({
      tickerSymbol: {
        field: 'TICKER_SYMBOL',
        type: STRING,
        allowNull: false
      },
      action: {
        field: 'ACTION',
        type: STRING,
        allowNull: false,
        validate: {
            isIn: [["BUY", "SELL"]]
        }
      },
      quantity: {
        field: 'QUANTITY',
        type: DOUBLE,
        allowNull: false,
        validate: {
            min: 1
        }
      },
      price: {
        field: 'PRICE',
        type: DOUBLE,
        validate: {
            min: 0
        }
      },
      createdOn: {
        field: 'CREATED_ON',
        type: DATE
      },
      updatedOn: {
        field: 'UPDATED_ON',
        type: DATE
      },
      deletedOn: {
        field: 'DELETED_ON',
        type: DATE
      }
}, { freezeTableName: true, tableName: 'trades', timestamps: false, sequelize })