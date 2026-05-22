import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database/sequelize";

class GrupoInformacion extends Model {}

GrupoInformacion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue:
        "REASONS (Research in Engineering and Advanced Sustainable Operations, Nature, and Society)",
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    objetivoGeneral: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    objetivosEspecificos: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    dominio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    direccion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    logo: {
      type: DataTypes.STRING,
      defaultValue: "/uploads/grupo_informacion/default.png",
    },
  },

  {
    sequelize,
    tableName: "grupo_informacion",
    timestamps: true,
  }
);

export default GrupoInformacion;