import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';

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
            // Running in a production environment (e.g., AWS Lambda)
            console.log('Running in AWS Lambda environment');
            browser = await puppeteer.launch({
                args: chromium.args,
                executablePath: await chromium.executablePath,
                headless: chromium.headless,
            });
        } else {
            // Running in a local development environment
            console.log('Running in local development environment');
            browser = await puppeteer.launch({
                headless: true, // Default headless mode
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