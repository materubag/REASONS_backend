import Investigador from "./investigador.model";
import Proyecto from "./proyecto.model";
import Publicacion from "./publicacion.model";
import LineaInvestigacion from "./lineaInvestigacion.model";
import Contacto from "./contacto.model";
import GrupoInformacion from "./grupoInformacion.model";
import Usuario from "./usuario.model";
import ProyectoObjetivo from "./proyectoObjetivo.model";
import ProyectoKeyword from "./proyectoKeyword.model";
import PublicacionKeyword from "./publicacionKeyword.model";
import GrupoObjetivo from "./grupoObjetivo.model";


//
// Investigadores <-> Proyectos
//

Investigador.belongsToMany(Proyecto, {
  through: "investigador_proyectos",
  foreignKey: "investigadorId",
  as: "proyectos",
});

Proyecto.belongsToMany(Investigador, {
  through: "investigador_proyectos",
  foreignKey: "proyectoId",
  as: "investigadores",
});

//
// Investigadores <-> Publicaciones
//

Investigador.belongsToMany(Publicacion, {
  through: "investigador_publicaciones",
  foreignKey: "investigadorId",
  as: "publicaciones",
});

Publicacion.belongsToMany(Investigador, {
  through: "investigador_publicaciones",
  foreignKey: "publicacionId",
  as: "investigadores",
});

//
// Publicaciones <-> Líneas de investigación
//

Publicacion.belongsToMany(LineaInvestigacion, {
  through: "publicacion_lineas",
  foreignKey: "publicacionId",
  as: "lineas",
});

LineaInvestigacion.belongsToMany(Publicacion, {
  through: "publicacion_lineas",
  foreignKey: "lineaId",
  as: "publicaciones",
});

//
// Proyectos <-> Líneas de investigación
//

Proyecto.belongsToMany(LineaInvestigacion, {
  through: "proyecto_lineas",
  foreignKey: "proyectoId",
  as: "lineas",
});

LineaInvestigacion.belongsToMany(Proyecto, {
  through: "proyecto_lineas",
  foreignKey: "lineaId",
  as: "proyectos",
});

//
// Relaciones uno a muchos (Objetivos y Keywords)
//

Proyecto.hasMany(ProyectoObjetivo, {
  as: "objetivosList",
  foreignKey: "proyectoId",
  onDelete: "CASCADE",
  hooks: true,
});
ProyectoObjetivo.belongsTo(Proyecto, {
  foreignKey: "proyectoId",
});

Proyecto.hasMany(ProyectoKeyword, {
  as: "keywordsList",
  foreignKey: "proyectoId",
  onDelete: "CASCADE",
  hooks: true,
});
ProyectoKeyword.belongsTo(Proyecto, {
  foreignKey: "proyectoId",
});

Publicacion.hasMany(PublicacionKeyword, {
  as: "keywordsList",
  foreignKey: "publicacionId",
  onDelete: "CASCADE",
  hooks: true,
});
PublicacionKeyword.belongsTo(Publicacion, {
  foreignKey: "publicacionId",
});

GrupoInformacion.hasMany(GrupoObjetivo, {
  as: "objetivosEspecificosList",
  foreignKey: "grupoId",
  onDelete: "CASCADE",
  hooks: true,
});
GrupoObjetivo.belongsTo(GrupoInformacion, {
  foreignKey: "grupoId",
});

//
// EXPORTS
//

export {
  Usuario,
  Investigador,
  Proyecto,
  Publicacion,
  LineaInvestigacion,
  Contacto,
  GrupoInformacion,
  ProyectoObjetivo,
  ProyectoKeyword,
  PublicacionKeyword,
  GrupoObjetivo,
};