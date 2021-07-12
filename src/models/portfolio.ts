import { Model, STRING, DATE, BIGINT, BOOLEAN, HasManyGetAssociationsMixin, HasManyCreateAssociationMixin, HasManyAddAssociationMixin, DOUBLE } from "sequelize";
import { sequelize } from "../core/connection";

export class Portfolio extends Model {
  id!: number;
  tickerSymbol!: string;
  avgPrice!: number;
  quantity!: number;
}

Portfolio.init({
      tickerSymbol: {
        field: 'TICKER_SYMBOL',
        type: STRING,
        allowNull: false,
        unique: true
      },
      quantity: {
        field: 'QUANTITY',
        type: DOUBLE,
        allowNull: false,
        validate: {
            min: 0
        }
      },
      avgPrice: {
        field: 'AVG_PRICE',
        type: DOUBLE,
        allowNull: false,
        validate: {
            min: 0
        }
      },
}, { freezeTableName: true, tableName: 'portfolio', timestamps: false, sequelize })