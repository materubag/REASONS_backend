import Investigador from "./investigador.model";
import Proyecto from "./proyecto.model";
import Publicacion from "./publicacion.model";
import LineaInvestigacion from "./lineaInvestigacion.model";
import Contacto from "./contacto.model";
import GrupoInformacion from "./grupoInformacion.model";
import Usuario from "./usuario.model";

//
// Investigadores <-> Proyectos
//

Investigador.belongsToMany(Proyecto, {
  through: "investigador_proyectos",
  foreignKey: "investigadorId",
});

Proyecto.belongsToMany(Investigador, {
  through: "investigador_proyectos",
  foreignKey: "proyectoId",
});

//
// Investigadores <-> Publicaciones
//

Investigador.belongsToMany(Publicacion, {
  through: "investigador_publicaciones",
  foreignKey: "investigadorId",
});

Publicacion.belongsToMany(Investigador, {
  through: "investigador_publicaciones",
  foreignKey: "publicacionId",
});

//
// Proyectos <-> Líneas de investigación
//

Proyecto.belongsToMany(LineaInvestigacion, {
  through: "proyecto_lineas",
  foreignKey: "proyectoId",
});

LineaInvestigacion.belongsToMany(Proyecto, {
  through: "proyecto_lineas",
  foreignKey: "lineaId",
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
};