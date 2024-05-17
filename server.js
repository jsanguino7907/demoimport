import express from 'express';
import { getDataZIM } from './netlify/functions/index.js';
import helmet from 'helmet';
import { check, validationResult } from 'express-validator';

const app = express();

// Middleware para seguridad básica con Helmet
app.use(helmet());

// Middleware para Content-Security-Policy-Report-Only
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy-Report-Only',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self'; frame-src 'self'; report-uri /csp-violation-report-endpoint"
    );
    next();
});

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
        console.log('Calling getDataZIM with parameters:', { number, type, sealine }); // Log parameters
        const htmls = await getDataZIM(number, type, sealine);
        res.json(htmls);
    } catch (error) {
        console.error('Error en la ruta /getDataZIM:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para recibir reportes de CSP
app.post('/csp-violation-report-endpoint', express.json(), (req, res) => {
    console.log('CSP Violation:', req.body);
    res.status(204).end(); // Responde con 204 No Content
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));