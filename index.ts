import { program } from 'commander'
import puppeteer from 'puppeteer'
import which from 'which'

program
  .argument('<channel>', 'YouTube channel name, e.g. @EthosLab')
  .option('--json', 'print output in JSON')
  .showHelpAfterError()
  .allowExcessArguments(false)
  .parse()

const channel = program.args[0]
const options = program.opts()

const browsers = [
  'brave',
  'chromium',
  'chrome',
  'firefox'
]

const executablePath = await browsers.reduce(async (prev, curr) => {
  return (await prev) ? prev : which(curr).catch(() => undefined)
}, Promise.resolve(undefined) as Promise<string | undefined>)

if (!executablePath) {
  console.error('No compatible browser found for web scraping')
  process.exit(1)
}

const browser = await puppeteer.launch({
  browser: executablePath.includes('firefox') ? 'firefox' : 'chrome',
  executablePath
})
const page = await browser.newPage()

const url = `https://www.youtube.com/${channel}/videos`
await page.goto(url)
const results = await page.$$eval('a#video-title-link', (els) => els.map(el => ({
  link: el.href,
  title: el.querySelector('#video-title')?.textContent
})))

if (!results.length) {
  console.error(`No videos found at ${url}`)
  process.exit(1)
}

results.reverse()

if (options.json) {
  console.log(JSON.stringify(results)) 
} else {
  for (const { link, title } of results) {
    console.log(`\x1b]8;;${link}\x1b\\🔗\x1b]8;;\x1b\\ ${title}`)
  }
}

await browser.close()
