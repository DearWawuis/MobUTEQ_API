const pool = require('../models/Db.model');
const admin = require('firebase-admin');
const moment = require('moment');
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.FIREBASE_PROJECT_ID);
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const sendNotification = (token, message) => {
    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      android: {
        priority: "high", 
        notification: {
          sound: "default", 
          icon: "logo", 
        }
      },
      token: token,
    };
  
    admin.messaging().send(payload)
      .then((response) => {
        console.log('Notificación enviada:', response);
      })
      .catch((error) => {
        console.error('Error al enviar la notificación:', error);
      });
  };

//Buscar horas proximas
exports.getUpcomingEvents = () => {
    const today = new Date();
    const options = { weekday: 'long' };
    const day = today.toLocaleDateString('es-ES', options);
    const now = moment().format('HH:mm:ss');
    const in5Minutes = moment().add(5, 'minutes').format('HH:mm:ss');

    const sql = `
      SELECT h.id, u.token_telefono, h.edificio, h.aula, h.hora_inicio, h.hora_fin, m.nombre, h.profesor
      FROM horario_clases AS h
      INNER JOIN materias as m ON m.id = h.id_materia
      INNER JOIN usuarios as u ON u.id = h.id_usuario
      WHERE h.dia_semana = ? 
      AND h.hora_inicio = ?
      ORDER BY h.hora_inicio ASC
    `;

    pool.query(sql, [day, in5Minutes], (err, results) => {
        if (err) throw err;
        results.forEach((clase) => {
          //sendPushNotification(clase.id_usuario, clase.nombre);
          const token = clase.token_telefono;
        if (token) {
          sendNotification(token, { 
            title: `Próxima clase: ${clase.nombre}`, 
            body: `Profesor: ${clase.profesor} - Edificio: ${clase.edificio} - Aula: ${clase.aula}` 
        });
        }
        });
    });
  };

    // Actualizar token del usuario
exports.updateTokenPhone = async (req, res) => {
    const { token } = req.body;
    const { user } = req.params;
    const query = `UPDATE usuarios SET 
        token_telefono = ?
    WHERE id = ?`;
    
    pool.query(query, [token, user], (err) => {
        if (err) {
            return res.status(400).send({ message: 'Error al cambiar token de telefono' });
        }

        res.send({ message: 'Ok al cambiar token.'});
    });
  };
