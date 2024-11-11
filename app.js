import express from 'express';
const bodyParser = require('body-parser');
import authRoutes from './src/routes/auth.routes';
import calendarRoutes from './src/routes/calendar.routes';
import mapaRoutes from './src/routes/mapa.routes';
import cuatriRoutes from './src/routes/cuatrimestre.routes';
const connectDB = require('./src/config/db');
const photoRoutes = require('./src/routes/photo.routes');

const app = express();
const cors = require('cors');

// Configura el tamaño máximo de la carga (aquí está configurado a 10MB, pero puedes ajustarlo)
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// Configuración de CORS para permitir peticiones desde localhost
const corsOptions = {
    origin: 'http://localhost:8100',  // Permite solo solicitudes desde este dominio
    methods: ['GET', 'POST', 'DELETE'],        // Permite métodos GET y POST
    allowedHeaders: ['Content-Type', 'Authorization'], // Permite ciertos encabezados
  };

// Middleware para habilitar CORS (si es necesario)
app.use(cors(corsOptions));
// Middleware para parsear cuerpos de solicitud como JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/mapa', mapaRoutes);
app.use('/api/cuatrimestre', cuatriRoutes);
app.use('/api/photo', photoRoutes);

// Ruta para servir la SPA
app.get('/', (req, res) => {
    res.send('MobUTEQ API');
});

export default app;
