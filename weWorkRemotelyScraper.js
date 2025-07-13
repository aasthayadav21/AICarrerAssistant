const puppeteer = require('puppeteer');

async function scrapeJobsFromWWR(keywords = []) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const url = 'https://weworkremotely.com/categories/remote-programming-jobs';

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    const jobs = await page.evaluate((keywords) => {
      const jobSections = document.querySelectorAll('section.jobs > article > ul li:not(.view-all)');

      const jobsArray = Array.from(jobSections).map(job => {
        const title = job.querySelector('span.title')?.innerText.trim() || '';
        const company = job.querySelector('span.company')?.innerText.trim() || '';
        const linkSuffix = job.querySelector('a')?.getAttribute('href') || '';
        const link = linkSuffix.startsWith('http') ? linkSuffix : `https://weworkremotely.com${linkSuffix}`;
        const location = job.querySelector('.region')?.innerText.trim() || 'Remote';

        return { title, company, link, location };
      });

      return jobsArray.filter(job =>
        keywords.some(keyword =>
          job.title.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }, keywords);

    await browser.close();
    return jobs;
  } catch (err) {
    console.error('❌ WWR scraping failed:', err.message);
    await browser.close();
    return [];
  }
}

module.exports = scrapeJobsFromWWR;
