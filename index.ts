import { program } from 'commander'
import puppeteer, { SupportedBrowser } from 'puppeteer'
import which from 'which'

program
  .argument('<channel>', 'YouTube channel name, e.g. @EthosLab')
  .option('--json', 'print output in JSON')
  .showHelpAfterError()
  .allowExcessArguments(false)
  .parse()

const channel = program.args[0]
const options = program.opts()

const browsers: Record<string, SupportedBrowser> = {
  brave: 'chrome',
  chromium: 'chrome',
  chrome: 'chrome',
  firefox: 'firefox',
}

let executablePath: string | undefined = undefined
let browser: SupportedBrowser | undefined = undefined

for (const [key, value] of Object.entries(browsers)) {
  try {
    executablePath = await which(key)
    browser = value
    break
  } catch {
    continue
  }
}

if (!executablePath) {
  console.error('No compatible browser found for web scraping')
  process.exit(1)
}

const puppet = await puppeteer.launch({ executablePath, browser })
const page = await puppet.newPage()

const url = `https://www.youtube.com/${channel}/videos`
await page.goto(url)

const results = await page.$$eval('a#video-title-link', (els) => els.map(el => ({
  link: el.href,
  title: el
    .querySelector('#video-title')
    ?.textContent,
  timestamp: el
    .closest('#meta')
    ?.querySelector('.inline-metadata-item:nth-of-type(2)')
    ?.textContent,
})))

if (!results.length) {
  console.error(`No videos found at ${url}`)
  process.exit(1)
}

results.reverse()

if (options.json) {
  console.log(JSON.stringify(results)) 

} else {
  for (const { link, title, timestamp } of results) {
    console.log(`\x1b]8;;${link}\x1b\\🔗\x1b]8;;\x1b\\ ${title} \x1b[2m• ${timestamp}\x1b[22m`)
  }
}

process.exit(0)
