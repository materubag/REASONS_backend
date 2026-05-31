import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class Proyecto extends Model {}

Proyecto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    descripcionExtendida: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    resultados: {
      type: DataTypes.TEXT,
    },

    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

  },

  {
    sequelize,
    tableName: "proyectos",
    timestamps: true,
  }
);

export default Proyecto;