const puppeteer = require('puppeteer');

async function scrapeIndeed(keywords = ['developer'], location = 'India') {
  const query = keywords[0] || 'developer';
  const url = `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}&l=${encodeURIComponent(location)}&sort=date`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36'
  );

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const jobs = await page.evaluate((keywords) => {
      const listings = document.querySelectorAll('.job_seen_beacon');
      const results = [];

      listings.forEach((el) => {
        const title = el.querySelector('h2.jobTitle')?.innerText.trim() || '';
        const company = el.querySelector('.companyName')?.innerText.trim() || '';
        const location = el.querySelector('.companyLocation')?.innerText.trim() || 'Remote';
        const linkPath = el.querySelector('a')?.getAttribute('href');
        const link = linkPath ? `https://www.indeed.com${linkPath}` : '#';

        const matched = keywords.some(kw =>
          title.toLowerCase().includes(kw.toLowerCase())
        );

        if (matched && title && company && link) {
          results.push({ title, company, location, link });
        }
      });

      return results;
    }, keywords);

    await browser.close();
    return jobs;
  } catch (err) {
    console.error('❌ Error scraping Indeed:', err.message);
    await browser.close();
    return [];
  }
}

module.exports = scrapeIndeed;
