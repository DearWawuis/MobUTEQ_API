import express from 'express';
const bodyParser = require('body-parser');
import authRoutes from './src/routes/auth.routes';
import calendarRoutes from './src/routes/calendar.routes';
import mapaRoutes from './src/routes/mapa.routes';
import cuatriRoutes from './src/routes/cuatrimestre.routes';
const connectDB = require('./src/config/db');
const photoRoutes = require('./src/routes/photo.routes');
import notificationRoutes from './src/routes/notification.routes';
const notificationController = require('./src/controllers/notification.controller');
const schedule = require('node-schedule');

const app = express();
const cors = require('cors');

// Configuración de CORS para permitir peticiones desde localhost
const corsOptions = {
  //origin: 'http://localhost:8100',  // Permite solicitudes desde el dominio de prueba
  origin: '*', //Permite solicitudes desde cualquier dominio
  methods: ['GET', 'POST', 'DELETE', 'PUT'],  // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],  // Encabezados permitidos
};

// Middleware para habilitar CORS (si es necesario)
app.use(cors(corsOptions));
// Ruta global para manejar solicitudes OPTIONS
app.options('*', cors(corsOptions));

// Configura el tamaño máximo de la carga (aquí está configurado a 10MB, pero puedes ajustarlo)
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// Middleware para parsear cuerpos de solicitud como JSON
app.use(express.json());

// Conectar a la base de datos
//connectDB();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/mapa', mapaRoutes);
app.use('/api/cuatrimestre', cuatriRoutes);
app.use('/api/photo', photoRoutes);
app.use('/api/notificacion', notificationRoutes);
/*
schedule.scheduleJob('* * * * *', function() {
  const datos = notificationController.getUpcomingEvents();
  console.log(datos);
});*/

// Ruta para servir la SPA
app.get('/', (req, res) => {
    res.send('MobUTEQ API');
});

export default app;
