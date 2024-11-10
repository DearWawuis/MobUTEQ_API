import express from 'express';
import authRoutes from './src/routes/auth.routes';
import calendarRoutes from './src/routes/calendar.routes';
import mapaRoutes from './src/routes/mapa.routes';
import cuatriRoutes from './src/routes/cuatrimestre.routes';
const connectDB = require('./src/config/db');
const photoRoutes = require('./src/routes/photo.routes');

const app = express();
const cors = require('cors');

// Middleware para parsear cuerpos de solicitud como JSON
app.use(express.json());

// Middleware para habilitar CORS (si es necesario)
app.use(cors());

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
