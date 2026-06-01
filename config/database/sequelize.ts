import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isDev = process.env.IS_DEV === "true";
const isProd = process.env.NODE_ENV === "production" || !isDev;
const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: "postgres",
      logging: false,
      define: {
        timestamps: true,
      },
      dialectOptions: isProd
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    })
  : new Sequelize(
      process.env.DB_NAME as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: "postgres",
        logging: false,
        define: {
          timestamps: true,
        },
        dialectOptions: isProd
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : {},
      }
    );

export default sequelize;