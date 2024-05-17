import express from 'express';
import serverless from 'serverless-http';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';
import helmet from 'helmet';
import { check, validationResult } from 'express-validator';

/**
 * Get data from ZIM container tracking.
 * This function scrapes the tracking information for a given container number, type, and sealine from the SeaRates website.
 * 
 * @param {string} number - Container number.
 * @param {string} type - Container type.
 * @param {string} sealine - Sealine.
 * @returns {Promise<Object>} - HTML content of the tracking element.
 * @throws {Error} - Throws error if something goes wrong.
 */
export async function getDataZIM(number, type, sealine) {
    console.log('getDataZIM called with parameters:', { number, type, sealine });

    if (!number || !type || !sealine) {
        throw new Error("Invalid input parameters. Please provide number, type, and sealine.");
    }

    const url = `https://www.searates.com/es/container/tracking/?number=${number}&type=${type}&sealine=${sealine}`;
    let browser = null;

    try {
        if (process.env.AWS_EXECUTION_ENV) {
            console.log('Running in AWS Lambda environment');
            browser = await puppeteer.launch({
                args: chromium.args,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
            });
        } else {
            console.log('Running in local development environment');
            browser = await puppeteer.launch({
                headless: true, // Default headless mode
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: puppeteer.executablePath()
            });
        }

        console.log('Launching Puppeteer browser...');
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });

        const html1 = await page.evaluate(() => {
            const shadowRoot = document.querySelector("#tracking_system_root").shadowRoot;
            const trackingElement = shadowRoot.querySelector("#app-root > div.jNVSgr > div.sTC0fR > div.OZ_R4c");
            return trackingElement ? trackingElement.outerHTML : null;
        });

        console.log('Scraping completed successfully');
        return { html1 };
    } catch (error) {
        console.error("Error occurred while getting data from ZIM:", error);
        throw new Error(`Failed to get data from ZIM: ${error.message}`);
    } finally {
        if (browser && browser.close) {
            console.log('Closing Puppeteer browser...');
            await browser.close();
        }
    }
}

// Configuración del servidor Express
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

/**
 * Middleware de validación para los parámetros de la ruta /getDataZIM.
 * Valida y sanitiza los parámetros de consulta: number, type, y sealine.
 */
const validateGetDataZIM = [
    check('number').trim().isLength({ min: 1 }).withMessage('El parámetro number es requerido.'),
    check('type').trim().isLength({ min: 1 }).withMessage('El parámetro type es requerido.'),
    check('sealine').trim().isLength({ min: 1 }).withMessage('El parámetro sealine es requerido.')
];

/**
 * Ruta para /getDataZIM.
 * Procesa las solicitudes GET para obtener los datos de seguimiento de ZIM.
 * 
 * @route GET /getDataZIM
 * @param {string} number - Container number.
 * @param {string} type - Container type.
 * @param {string} sealine - Sealine.
 * @returns {Object} - JSON con el contenido HTML del elemento de seguimiento.
 * @throws {Error} - Error interno del servidor.
 */
app.get('/getDataZIM', validateGetDataZIM, async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { number, type, sealine } = req.query;

    try {
        console.log('Calling getDataZIM with parameters:', { number, type, sealine });
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

/**
 * Exportar el manejador de Netlify.
 * Utiliza serverless-http para crear una función compatible con Netlify.
 */
export const handler = serverless(app);