const pool = require('../models/Db.model'); // Importa el pool configurado

// Obtener los 3 mejores usuarios
exports.getTopUsers = (callback) => {
    const sql = `
        SELECT 
            u.id AS usuario_id,
            u.nombre AS usuario_nombre,
            AVG(c.calificacion) AS promedio
        FROM 
            usuarios u
        JOIN 
            calificaciones c ON u.id = c.id_usuario
        GROUP BY 
            u.id, u.nombre
        ORDER BY 
            promedio DESC
        LIMIT 3;
    `;
    
    // Ejecutar la consulta
    pool.query(sql, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
