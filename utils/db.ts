import { Sequelize } from "sequelize";

/**
 * Resets the PostgreSQL auto-increment sequences for all key tables.
 * This is crucial when tables are seeded with explicit integer IDs,
 * as Postgres serial sequences are not automatically updated during explicit inserts,
 * causing duplicate key violations on subsequent inserts.
 */
export const resetSequences = async (sequelize: Sequelize) => {
  const tables = [
    "investigadores",
    "usuarios",
    "proyectos",
    "publicaciones",
    "lineas_investigacion"
  ];

  for (const table of tables) {
    try {
      // Use pg_get_serial_sequence to resolve the correct sequence name,
      // and setval to align the next autoincrement ID to MAX(id) + 1.
      await sequelize.query(`
        SELECT setval(
          pg_get_serial_sequence('${table}', 'id'),
          COALESCE((SELECT MAX(id) FROM "${table}"), 0) + 1,
          false
        );
      `);
    } catch (err) {
      console.error(`✗ Error al resetear la secuencia de la tabla "${table}":`, err);
    }
  }
};
