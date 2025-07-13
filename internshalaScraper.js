const puppeteer = require('puppeteer');

async function scrapeJobsFromInternshala(suggestions = []) {
  const keyword = suggestions[0] || 'web development';
  const searchUrl = `https://internshala.com/internships/keywords-${encodeURIComponent(keyword)}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(searchUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Wait for internships to load
    await page.waitForSelector('.internship_meta', { timeout: 30000 });

    const jobs = await page.evaluate((suggestions) => {
      const jobElements = document.querySelectorAll('.internship_meta');
      const results = [];

      jobElements.forEach(el => {
        const parent = el.closest('.individual_internship');
        const title = parent?.querySelector('h3 a')?.innerText?.trim() || '';
        const company = parent?.querySelector('.company_name')?.innerText?.trim() || 'Unknown';
        const location = parent?.querySelector('.location_link')?.innerText?.trim() || 'Remote';
        const relativeLink = parent?.querySelector('h3 a')?.getAttribute('href') || '';
        const url = 'https://internshala.com' + relativeLink;

        const isMatch = suggestions.some(keyword =>
          title.toLowerCase().includes(keyword.toLowerCase())
        );

        if (isMatch) {
          results.push({ title, company, location, link: url });
        }
      });

      return results;
    }, suggestions);

    await browser.close();
    return jobs;
  } catch (error) {
    console.error('❌ Error scraping Internshala:', error.message);
    return [];
  }
}

module.exports = scrapeJobsFromInternshala;
