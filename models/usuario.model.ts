import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class Usuario extends Model {}

Usuario.init(
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

    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    rol: {
      type: DataTypes.ENUM("admin"),
      defaultValue: "admin",
    },

    microsoft_oid: {
      type: DataTypes.STRING(150),
      allowNull: true,
      unique: true,
    },
  },

  {
    sequelize,
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;