import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class PublicacionKeyword extends Model {}

PublicacionKeyword.init(
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

    publicacionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

  {
    sequelize,
    tableName: "publicacion_keywords",
    timestamps: true,
  }
);

export default PublicacionKeyword;
