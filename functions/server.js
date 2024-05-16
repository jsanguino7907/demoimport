import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import os from 'os';

const app = express();

// Habilitar CORS
app.use(cors());

const router = express.Router();

async function getDataZIM(number, type, sealine) {
    const url = `https://www.searates.com/es/container/tracking/?number=${number}&type=${type}&sealine=${sealine}`;

    // Configuración del path para Chrome en Netlify
    const executablePath = await chrome.executablePath;

    try {
        const browser = await puppeteer.launch({
            executablePath,
            args: chrome.args,
            headless: chrome.headless,
        });
        const page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(url, { waitUntil: 'networkidle2' });

        const element1 = await page.evaluateHandle(() => {
            return document.querySelector("#tracking_system_root").shadowRoot.querySelector("#app-root > div.jNVSgr > div.sTC0fR > div.OZ_R4c");
        });

        const html1 = await page.evaluate(element => element.outerHTML, element1);

        await browser.close();
        return { html1 };
    } catch (error) {
        console.error("Error occurred while getting data from ZIM:", error);
        throw error;
    }
}

// Definir la ruta usando el router
router.get('/getDataZIM', async(req, res) => {
    const { number, type, sealine } = req.query;

    if (!number || !type || !sealine) {
        return res.status(400).send('Faltan parámetros de consulta requeridos: number, type, sealine');
    }

    try {
        const htmls = await getDataZIM(number, type, sealine);
        res.json(htmls);
    } catch (error) {
        console.error('Error en la ruta /getDataZIM:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Usar el router en la aplicación
app.use('/.netlify/functions/server', router);

// Exportar el manejador de serverless
export const handler = serverless(app);

// Iniciar el servidor localmente si no está en producción
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.use('/', router); // Configurar el router para que funcione localmente
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
}

// Script adicional para automatizar tareas
(async() => {
    // Configuración del path para Chrome en Netlify
    const executablePath = await chrome.executablePath;

    const browser = await puppeteer.launch({
        executablePath,
        args: chrome.args,
        headless: chrome.headless,
    });
    const page = await browser.newPage();

    // Navegar a la URL
    await page.goto('https://developer.chrome.com/');

    // Configurar el tamaño de la pantalla
    await page.setViewport({ width: 1080, height: 1024 });

    // Escribir en el cuadro de búsqueda
    await page.type('.devsite-search-field', 'automate beyond recorder');

    // Esperar y hacer clic en el primer resultado
    const searchResultSelector = '.devsite-result-item-link';
    await page.waitForSelector(searchResultSelector);
    await page.click(searchResultSelector);

    // Localizar el título completo con una cadena única
    const textSelector = await page.waitForSelector('text/Customize and automate');
    const fullTitle = textSelector ? await textSelector.evaluate(el => el.textContent) : 'No title found';

    // Imprimir el título completo
    console.log('The title of this blog post is "%s".', fullTitle);

    await browser.close();
})();