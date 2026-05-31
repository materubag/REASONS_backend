import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import "./models";

import { connectDB, sequelize } from "./config/database";
import { resetSequences } from "./utils/db";

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB();

    const isDev = process.env.IS_DEV === "true";

    if (isDev) {
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync();
    }

    // Automatically fast-forward sequences to match MAX(id) of seeded/existing rows
    await resetSequences(sequelize);

    app.listen(PORT, () => {
      console.log(`Servidor en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando servidor:", error);
    process.exit(1);
  }
};

startServer();