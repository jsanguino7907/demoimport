import express from 'express';
import { getDataZIM } from './lambda.js';
import helmet from 'helmet';
import { check, validationResult } from 'express-validator';

const app = express();

// Middleware para seguridad básica
app.use(helmet());

// Validación y sanitización de los parámetros
const validateGetDataZIM = [
    check('number').trim().isLength({ min: 1 }).withMessage('El parámetro number es requerido.'),
    check('type').trim().isLength({ min: 1 }).withMessage('El parámetro type es requerido.'),
    check('sealine').trim().isLength({ min: 1 }).withMessage('El parámetro sealine es requerido.')
];

/**
 * Route handler for /getDataZIM
 * Validates query parameters and fetches data using getDataZIM function
 */
app.get('/getDataZIM', validateGetDataZIM, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { number, type, sealine } = req.query;

    try {
        const htmls = await getDataZIM(number, type, sealine);
        res.json(htmls);
    } catch (error) {
        console.error('Error en la ruta /getDataZIM:', error);
        res.status(500).send('Error interno del servidor');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));