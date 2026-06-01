import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class Publicacion extends Model {}

Publicacion.init(
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

    autores: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    resumen: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    cita: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    portada: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    doi: {
      type: DataTypes.STRING,
    },

    url: {
      type: DataTypes.STRING,
    },
  },

  {
    sequelize,
    tableName: "publicaciones",
    timestamps: true,
  }
);

export default Publicacion;