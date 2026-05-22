import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class LineaInvestigacion extends Model {}

LineaInvestigacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: "lineas_investigacion",
    timestamps: true,
  }
);

export default LineaInvestigacion;