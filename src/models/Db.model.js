const mysql = require('mysql2');

// Configurar el pool de conexiones a MySQL (con los datos de AWS)
const pool = mysql.createPool({
  host: 'mobuteq.cxk8g0o2e0ju.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'B4ckintha2024NEW',
  database: 'mobuteq',
  waitForConnections: true,     // Esperar si todas las conexiones están ocupadas
  connectionLimit: 50,          // Número máximo de conexiones en el pool
  queueLimit: 0,                // Número máximo de consultas en la cola (0 significa sin límite)
  ssl: {
    rejectUnauthorized: false    // Habilitar SSL
  }
});

// Probar la conexión al pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error obteniendo una conexión del pool: ', err);
    return;
  }
  console.log('Conexión exitosa al pool de MySQL.');
  
  // Liberar la conexión de vuelta al pool
  connection.release();
});

module.exports = pool;
