import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class ProyectoObjetivo extends Model {}

ProyectoObjetivo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    proyectoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: "proyecto_objetivos",
    timestamps: true,
  }
);

export default ProyectoObjetivo;
