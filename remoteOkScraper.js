// scrapers/remoteOKScraper.js
const puppeteer = require('puppeteer');

async function scrapeJobsFromRemoteOK(skills = []) {
  const browser = await puppeteer.launch({
    headless: 'new', // ensures Chromium runs in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const url = 'https://remoteok.com/remote-dev-jobs';
  await page.goto(url, { waitUntil: 'networkidle2' });

  const jobs = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('tr.job'));
    return rows.map(row => {
      const title = row.querySelector('h2')?.innerText || '';
      const company = row.querySelector('.companyLink h3')?.innerText || '';
      const link = row.querySelector('a.preventLink')?.href || '';
      const location = row.querySelector('.location')?.innerText || 'Remote';
      const tags = Array.from(row.querySelectorAll('.tags .tag')).map(tag => tag.innerText.toLowerCase());
      return { title, company, link, location, tags };
    });
  });

  await browser.close();

  // ✅ Filter jobs that match at least one skill
  if (skills.length > 0) {
    const lowerSkills = skills.map(skill => skill.toLowerCase());
    return jobs.filter(job =>
      lowerSkills.some(skill =>
        job.title.toLowerCase().includes(skill) ||
        job.tags?.some(tag => tag.includes(skill))
      )
    );
  }

  // If no skills are provided, return top jobs
  return jobs;
}

module.exports = scrapeJobsFromRemoteOK;
