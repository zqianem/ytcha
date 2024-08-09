import { program } from 'commander'
import puppeteer from 'puppeteer'
import which from 'which'

program.argument('<channel>', 'YouTube channel name')
program.parse()
const channel = program.args[0]

const browser = await puppeteer.launch({
  browser: 'firefox',
  executablePath: await which('firefox'),
})
const page = await browser.newPage()

await page.goto(`https://www.youtube.com/${channel}/videos`)
const results = await page.$$eval('a#video-title-link', (els) => els.map(el => ({
  link: el.href,
  title: el.querySelector('#video-title')?.textContent
})))

if (!results.length) {
  console.error('No videos found: CSS selectors may be out of date')
  process.exit(1)
}

for (const { link, title } of results.reverse()) {
  console.log(`[\x1b]8;;${link}\x1b\\Link\x1b]8;;\x1b\\] ${title}`)
}

await browser.close()
