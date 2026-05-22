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

    objetivos: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    resultados: {
      type: DataTypes.TEXT,
    },

    imagen: {
      type: DataTypes.STRING,
      defaultValue: "/uploads/proyectos/default.png",
    },
  },

  {
    sequelize,
    tableName: "proyectos",
    timestamps: true,
  }
);

export default Proyecto;