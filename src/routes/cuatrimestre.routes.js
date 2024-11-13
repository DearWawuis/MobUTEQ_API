import express from 'express';
import { getCuatrimestres, createCuatrimestre, getCuatrimestre, deleteCuatrimestre, getMateriasByCuatrimestre, createCalificacion, getCalificacionesByAlumno } from '../controllers/cuatrimestre.controller';

const router = express.Router();

router.get('/:id_usuario', getCuatrimestres);
router.post('/:id_usuario', createCuatrimestre);
router.get('/:id_usuario/:cuatrimestre_id', getCuatrimestre);
router.delete('/:id_usuario/:cuatrimestre_id', deleteCuatrimestre);
router.get('/materias/cuatri/:cuatrimestreNumero', getMateriasByCuatrimestre);
router.post('/materias/calific', createCalificacion);
router.get('/calific/materias/:id_usuario/:numero_cuatrimestre', getCalificacionesByAlumno);

export default router;
