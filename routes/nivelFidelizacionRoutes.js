import express from 'express';
import { createNivelFidelizacion, getNivelesFidelizacion, getNivelFidelizacionById, updateNivelFidelizacion, deleteNivelFidelizacion } from '../controllers/nivelFidelizacionController.js';

const router = express.Router();

router.post('/', createNivelFidelizacion); // Crear un nivel de fidelización
router.get('/', getNivelesFidelizacion); // Obtener todos los niveles de fidelización
router.get('/:id', getNivelFidelizacionById); // Obtener un nivel de fidelización por ID
router.put('/:id', updateNivelFidelizacion); // Actualizar un nivel de fidelización
router.delete('/:id', deleteNivelFidelizacion); // Eliminar un nivel de fidelización

export default router;