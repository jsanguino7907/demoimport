import puppeteer from "puppeteer";
import fs from 'fs';
// import pdf from 'html-pdf';
import express from 'express';

const app = express();

async function getDataZIM(number, type, sealine) {
    const url = `https://www.searates.com/es/container/tracking/?number=${number}&type=${type}&sealine=${sealine}`;

    const browser = await puppeteer.launch({
        slowMo: 200,
        headless: true,
    });
    const page = await browser.newPage();

    // Set the viewport to 1920x1080
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url);

    // Extracting the first element using a CSS selector
    const element1 = await page.evaluateHandle(() => {
        return document.querySelector("#tracking_system_root").shadowRoot.querySelector("#app-root > div.jNVSgr > div.sTC0fR > div.OZ_R4c");
    });

    // Capture the first element in a PNG
    await element1.screenshot({ path: 'data/element1.png' });

    // Save the HTML of the first element
    const html1 = await page.evaluate(element => element.outerHTML, element1);
    fs.writeFileSync('data/element1.html', html1);

    // Convert the HTML to PDF
    pdf.create(html1).toFile('data/element1.pdf', function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });

    // Extracting the second element using a CSS selector
    const element2 = await page.evaluateHandle(() => {
        return document.querySelector("#tracking_system_root").shadowRoot.querySelector("#app-root > div.jNVSgr > div.bQFM_E");
    });

    // Capture the second element in a PNG
    await element2.screenshot({ path: 'data/element2.png' });

    // Closing the browser
    await browser.close();
}

app.get('/getDataZIM', (req, res) => {
    const { number, type, sealine } = req.query;
    getDataZIM(number, type, sealine);
    res.send('Datos capturados y guardados.');
});

app.listen(3000, () => console.log('Server running on port 3000'));