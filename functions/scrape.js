const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event, context) {
    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto('https://spacejelly.dev/');

        const title = await page.title();
        const description = await page.$eval('meta[name="description"]', element => element.content);

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: 'Ok',
                page: {
                    title,
                    description
                }
            })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error scraping the page'
            })
        };
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }
};