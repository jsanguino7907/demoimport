const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event, context) {
    const { number, type, sealine } = event.queryStringParameters;

    if (!number || !type || !sealine) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Missing required query parameters: number, type, sealine'
            })
        };
    }

    const url = `https://www.searates.com/es/container/tracking/?number=${number}&type=${type}&sealine=${sealine}`;

    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const element1 = await page.evaluateHandle(() => {
            return document.querySelector("#tracking_system_root").shadowRoot.querySelector("#app-root > div.jNVSgr > div.sTC0fR > div.OZ_R4c");
        });

        const html1 = await page.evaluate(element => element.outerHTML, element1);

        await browser.close();

        return {
            statusCode: 200,
            body: JSON.stringify({ html1 })
        };
    } catch (error) {
        console.error("Error:", error);

        if (browser !== null) {
            await browser.close();
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error scraping the page'
            })
        };
    }
};