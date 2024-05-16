import puppeteer from 'puppeteer';
import express from 'express';

const app = express();

async function getDataZIM(number, type, sealine) {
    const url = `https://www.searates.com/es/container/tracking/?number=${number}&type=${type}&sealine=${sealine}`;

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setViewport({ width: 1920, height: 1080 });

        // Navega a la URL especificada
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

app.get('/getDataZIM', async(req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));