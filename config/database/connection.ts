import sequelize from "./sequelize";

const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();

    console.log("PostgreSQL conectado correctamente");
  } catch (error) {
    console.error("Error al conectar PostgreSQL:", error);

    process.exit(1);
  }
};

export default connectDB;