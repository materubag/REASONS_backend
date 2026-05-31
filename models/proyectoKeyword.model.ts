import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class ProyectoKeyword extends Model {}

ProyectoKeyword.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    proyectoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: "proyecto_keywords",
    timestamps: true,
  }
);

export default ProyectoKeyword;
