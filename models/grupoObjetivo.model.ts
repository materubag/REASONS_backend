import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class GrupoObjetivo extends Model {}

GrupoObjetivo.init(
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

    grupoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: "grupo_objetivos",
    timestamps: true,
  }
);

export default GrupoObjetivo;
