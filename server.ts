import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import "./models";

import { connectDB, sequelize } from "./config/database";

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB();

    const isDev = process.env.IS_DEV === "true" || process.env.NODE_ENV === "development" || process.env.npm_lifecycle_event === "dev";

    if (isDev) {
      await sequelize.sync({ alter: true });
      console.log("Base sincronizada (alter)");
    } else {
      await sequelize.sync();
      console.log("Base sincronizada");
    }

    app.listen(PORT, () => {
      console.log(`Servidor en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando servidor:", error);
    process.exit(1);
  }
};

startServer();