import express from 'express';
import { createRole, getRoles, getRoleById, updateRole, deleteRole } from '../controllers/roleController.js';

const router = express.Router();

router.post('/', createRole); // Crear un rol
router.get('/', getRoles); // Obtener todos los roles
router.get('/:id', getRoleById); // Obtener un rol por ID
router.put('/:id', updateRole); // Actualizar un rol
router.delete('/:id', deleteRole); // Eliminar un rol

export default router;