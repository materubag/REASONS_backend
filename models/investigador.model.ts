import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class Investigador extends Model {
  public id!: number;
  public nombre!: string;
  public orcid!: string;
  public correo!: string;
  public biografia!: string;
  public cargo!: string;
  public foto!: string;
  public linkedin?: string;
  public facebook?: string;
  public instagram?: string;
  public telegram?: string;
}

Investigador.init(
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

    orcid: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },

    correo: {
      type: DataTypes.STRING(250),
      allowNull: false,
      unique: true,
    },

    biografia: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    cargo: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    foto: {
      type: DataTypes.STRING,
      defaultValue: "/uploads/investigadores/default.png",
    },

    linkedin: {
      type: DataTypes.STRING,
    },

    facebook: {
      type: DataTypes.STRING,
    },

    instagram: {
      type: DataTypes.STRING,
    },

    telegram: {
      type: DataTypes.STRING,
    },
  },

  {
    sequelize,
    tableName: "investigadores",
    timestamps: true,
  }
);

export default Investigador;