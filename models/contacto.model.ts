import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class Contacto extends Model {}

Contacto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },

  {
    sequelize,
    tableName: "contactos",
    timestamps: false,
  }
);

export default Contacto;