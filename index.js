import puppeteer from 'puppeteer';
import fs from 'fs';
import pdf from 'html-pdf';
import express from 'express';

const app = express();

async function getDataZIM(number, type, sealine) {
    const url = `https://www.searates.com/es/container/tracking/?number=${number}&type=${type}&sealine=${sealine}`;

    const browser = await puppeteer.launch({
        slowMo: 200,
        headless: true,
    });
    const page = await browser.newPage();

    // Establecer el tamaño de la ventana a 1920x1080
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);

    // Extraer el primer elemento usando un selector CSS
    const element1 = await page.evaluateHandle(() => {
        return document.querySelector("#tracking_system_root").shadowRoot.querySelector("#app-root > div.jNVSgr > div.sTC0fR > div.OZ_R4c");
    });

    // Capturar el primer elemento en un PNG
    await element1.screenshot({ path: 'data/element1.png' });

    // Guardar el HTML del primer elemento
    const html1 = await page.evaluate(element => element.outerHTML, element1);
    fs.writeFileSync('data/element1.html', html1);

    // Convertir el HTML a PDF
    pdf.create(html1).toFile('data/element1.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });

    // Extraer el segundo elemento usando un selector CSS
    const element2 = await page.evaluateHandle(() => {
        return document.querySelector("#tracking_system_root").shadowRoot.querySelector("#app-root > div.jNVSgr > div.bQFM_E");
    });

    // Capturar el segundo elemento en un PNG
    await element2.screenshot({ path: 'data/element2.png' });

    // Cerrar el navegador
    await browser.close();
}

app.get('/getDataZIM', async(req, res) => {
    const { number, type, sealine } = req.query;

    if (!number || !type || !sealine) {
        return res.status(400).send('Faltan parámetros de consulta requeridos: number, type, sealine');
    }

    try {
        await getDataZIM(number, type, sealine);
        res.send('Datos capturados y guardados.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));