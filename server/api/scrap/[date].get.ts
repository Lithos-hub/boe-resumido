import { chromium } from 'playwright';

/**
 * Scrapping API call using playwright.
 * This method scrap the https://boe.es/boe/dias/YYYY/MM/DD/ URL, giving the date as parameter
 *
 */

export default defineEventHandler(async (event) => {
  //   First we get the date given as parameter.
  // If it is not present, we throw an error
  // If the format is not YYYY/MM/DD (when scraping from the website), we throw an error
  const date = getRouterParam(event, 'date');

  if (!date) {
    throw createError({ statusCode: 400, statusMessage: 'Date is required' });
  }

  const formattedDate = date.replaceAll('-', '/');

  // Check if the date is in the correct format (YYYY/MM/DD)
  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(formattedDate)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid date format. Please use YYYY/MM/DD format.',
    });
  }

  const url = `https://boe.es/boe/dias/${formattedDate}/`;

  // We create a browser instance
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // We navigate to the URL
  await page.goto(url);

  //   First we get the <li class="dispo"> element
  const disposicionesGenerales = await page.$('.dispo');

  if (!disposicionesGenerales) {
    throw createError({
      statusCode: 404,
      statusMessage: 'disposicionesGenerales element not found',
    });
  }

  // Inside the disposicionesGenerales element, we get the <li class="puntoHTML"> element
  const otrosFormatosElement = await disposicionesGenerales.$('.puntoHTML');

  if (!otrosFormatosElement) {
    throw createError({
      statusCode: 404,
      statusMessage: 'otrosFormatosElement element not found',
    });
  }

  //   Finally, we get the <a> element inside the otrosFormatosElement
  const linkElement = await otrosFormatosElement.$('a');

  if (!linkElement) {
    throw createError({
      statusCode: 404,
      statusMessage: 'linkElement element not found',
    });
  }

  //   We navigate to the href of the link, that should be something similar to href="/diario_boe/txt.php?id=BOE-A-2025-410"
  const href = await linkElement.getAttribute('href');

  // We build the URL
  const docUrl = `https://boe.es${href}`;

  // We navigate to the docUrl
  await page.goto(docUrl);

  // If page text contains Error 404 message, we throw an error
  // const error404 = await page.getByText('Error 404');

  // if (error404) {
  //   throw createError({
  //     statusCode: 404,
  //     statusMessage: 'Error 404: Page not found',
  //   });
  // }

  //   In that page, we need to get the id="DOdocText" element
  const docTextElement = await page.$('#DOdocText');

  if (!docTextElement) {
    throw createError({
      statusCode: 404,
      statusMessage: 'docTextElement element not found',
    });
  }

  //   We get the text content of the element
  const text = await docTextElement.innerText();

  // We close the browser
  await browser.close();

  // We return the text and the link of the document
  return {
    text,
    link: docUrl,
  };
});
