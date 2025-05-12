const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/tiktok/:username', async (req, res) => {
  const username = req.params.username;
  const url = `https://www.tiktok.com/@${username}`;

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const followers = await page.locator('strong[data-e2e="followers-count"]').textContent();
    const profilePic = await page.locator('img[data-e2e="user-avatar"]').first().getAttribute('src');

    await browser.close();

    res.json({
      username,
      followers,
      profilePic,
      profileUrl: url
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch profile. Invalid username or TikTok blocked the request.' });
  }
});

app.get('/', (req, res) => {
  res.send('TikTok Profile API is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
