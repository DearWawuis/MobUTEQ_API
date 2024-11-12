import db from '../models/Db.model';  // Importar la conexión de la base de datos

// Obtener todos los cuatrimestres de un usuario
export const getCuatrimestres = (req, res) => {
    const { id_usuario } = req.params;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener conexión', error: err });
        }

        connection.query(`
      SELECT * FROM cuatrimestres
      WHERE id_usuario = ? ORDER BY CAST(SUBSTRING_INDEX(nombre, ' ', 1) AS UNSIGNED);`,
            [id_usuario],
            (error, results) => {
                connection.release(); // Liberar conexión después de usarla
                if (error) {
                    return res.status(500).json({ message: 'Error al obtener cuatrimestres', error });
                }
                res.json(results);
            }
        );
    });
};

// Crear un nuevo cuatrimestre para un usuario
export const createCuatrimestre = (req, res) => {
    const { id_usuario, nombre } = req.body;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener conexión', error: err });
        }

        // Consulta para obtener el número más alto de cuatrimestre para el usuario
        connection.query(
            `SELECT COALESCE(MAX(numero), 0) + 1 AS siguienteNumero FROM cuatrimestres WHERE id_usuario = ?`,
            [id_usuario],
            (error, results) => {
                if (error) {
                    connection.release();
                    return res.status(500).json({ message: 'Error al obtener el número del cuatrimestre', error });
                }

                const siguienteNumero = results[0].siguienteNumero; // Número consecutivo del cuatrimestre

                // Inserta el nuevo cuatrimestre con el número calculado
                connection.query(
                    `INSERT INTO cuatrimestres (id_usuario, numero, nombre) VALUES (?, ?, ?)`,
                    [id_usuario, siguienteNumero, nombre],
                    (insertError, result) => {
                        connection.release(); // Liberar conexión después de usarla

                        if (insertError) {
                            return res.status(500).json({ message: 'Error al crear cuatrimestre', error: insertError });
                        }

                        res.status(201).json({ message: 'Cuatrimestre creado exitosamente', id: result.insertId });
                    }
                );
            }
        );
    });
};

// Obtener un cuatrimestre específico de un usuario
export const getCuatrimestre = (req, res) => {
    const { id_usuario, cuatrimestre_id } = req.params;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener conexión', error: err });
        }

        connection.query(`
      SELECT * FROM cuatrimestres
      WHERE id = ? AND id_usuario = ?`,
            [cuatrimestre_id, id_usuario],
            (error, result) => {
                connection.release(); // Liberar conexión después de usarla
                if (error) {
                    return res.status(500).json({ message: 'Error al obtener el cuatrimestre', error });
                }
                res.json(result[0]);
            }
        );
    });
};

// Eliminar un cuatrimestre específico de un usuario
export const deleteCuatrimestre = (req, res) => {
    const { cuatrimestre_id, id_usuario } = req.params;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener conexión', error: err });
        }

        connection.query(`
        DELETE FROM cuatrimestres
        WHERE id = ? AND id_usuario = ?`,
            [cuatrimestre_id, id_usuario],
            (error, result) => {
                connection.release(); // Liberar conexión después de usarla
                if (error) {
                    return res.status(500).json({ message: 'Error al eliminar el cuatrimestre', error });
                }
                // Verificar si se eliminó alguna fila
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Cuatrimestre no encontrado o no eliminado' });
                }
                res.json({ message: 'Cuatrimestre eliminado exitosamente' });
            }
        );
    });
};

// Obtener materias de un cuatrimestre específico
export const getMateriasByCuatrimestre = (req, res) => {
    const { cuatrimestre_id } = req.params;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener conexión', error: err });
        }

        connection.query(`
            SELECT id, nombre 
            FROM materias 
            WHERE id_cuatrimestre = ?;
        `, [cuatrimestre_id], (error, results) => {
            connection.release();   

            if (error) {
                return res.status(500).json({ message: 'Error al obtener materias', error });
            }

            res.status(200).json(results);
        });
    });
};

// Crear una nueva calificación para una materia y parcial específicos
export const createCalificacion = (req, res) => {
    const { id_materia, id_usuario, parcial, calificacion } = req.body;

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener conexión', error: err });
        }

        // Inserta la materia en la tabla de calificaciones del usuario
        connection.query(`
            INSERT INTO calificaciones (id_materia, materia, parcial, calificacion)
            SELECT ?, nombre, ?, ?
            FROM materias
            WHERE id = ? AND id_cuatrimestre IN (SELECT id FROM cuatrimestres WHERE id_usuario = ?);
        `, [id_materia, parcial, calificacion, id_materia, id_usuario], (error, result) => {
            connection.release();

            if (error) {
                return res.status(500).json({ message: 'Error al agregar calificación', error });
            }

            res.status(201).json({ message: 'Calificación agregada exitosamente', id: result.insertId });
        });
    });
};

export const getCalificacionesByAlumno = (req, res) => {
    const { id_usuario, cuatrimestreId } = req.params;
    console.log("ID de usuario recibido:", id_usuario);
    console.log("ID de cuatrimestre recibido:", cuatrimestreId);

    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener conexión', error: err });
        }

        connection.query(`
            SELECT c.id AS id_calificacion, 
                   m.nombre AS materia, 
                   c.parcial, 
                   c.calificacion, 
                   c.created_at
            FROM calificaciones c
            JOIN materias m ON c.id_materia = m.id
            JOIN cuatrimestres cu ON m.id_cuatrimestre = cu.id
            WHERE cu.id = ? AND cu.id_usuario = ?
            ORDER BY c.parcial;
        `, [cuatrimestreId, id_usuario], (error, results) => {
            connection.release();
            console.log("Resultados de la consulta:", results);

            if (error) {
                return res.status(500).json({ message: 'Error al obtener calificaciones', error });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'No se encontraron calificaciones para este alumno en este cuatrimestre' });
            }

            res.json(results);
        });
    });
};