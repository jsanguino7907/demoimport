import express from 'express';
import serverless from 'serverless-http';
import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';
import helmet from 'helmet';
import { check, validationResult } from 'express-validator';

/**
 * Get data from ZIM container tracking
 * @param {string} number - Container number
 * @param {string} type - Container type
 * @param {string} sealine - Sealine
 * @returns {Promise<Object>} - HTML content of the tracking element
 * @throws {Error} - Throws error if something goes wrong
 */
async function getDataZIM(number, type, sealine) {
    if (!number || !type || !sealine) {
        throw new Error("Invalid input parameters. Please provide number, type, and sealine.");
    }

    const url = `https://www.searates.com/es/container/tracking/?number=${number}&type=${type}&sealine=${sealine}`;
    let browser = null;

    try {
        if (process.env.AWS_EXECUTION_ENV) {
            // Running in a production environment (e.g., AWS Lambda)
            browser = await puppeteer.launch({
                args: chromium.args,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
            });
        } else {
            // Running in a local development environment
            browser = await puppeteer.launch({
                headless: true, // Default headless mode
            });
        }

        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle2' });

        const html1 = await page.evaluate(() => {
            const shadowRoot = document.querySelector("#tracking_system_root").shadowRoot;
            const trackingElement = shadowRoot.querySelector("#app-root > div.jNVSgr > div.sTC0fR > div.OZ_R4c");
            return trackingElement ? trackingElement.outerHTML : null;
        });

        return { html1 };
    } catch (error) {
        console.error("Error occurred while getting data from ZIM:", error);
        throw new Error(`Failed to get data from ZIM: ${error.message}`);
    } finally {
        if (browser && browser.close) {
            await browser.close();
        }
    }
}

// Configuración del servidor Express
const app = express();

// Middleware para seguridad básica
app.use(helmet());

// Validación y sanitización de los parámetros
const validateGetDataZIM = [
    check('number').trim().isLength({ min: 1 }).withMessage('El parámetro number es requerido.'),
    check('type').trim().isLength({ min: 1 }).withMessage('El parámetro type es requerido.'),
    check('sealine').trim().isLength({ min: 1 }).withMessage('El parámetro sealine es requerido.')
];

// Ruta para /getDataZIM
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

// Exportar el manejador de Netlify
export const handler = serverless(app);