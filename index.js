import { program } from 'commander'
import puppeteer from 'puppeteer'
import which from 'which'

program
  .argument('<channel>', 'YouTube channel name, e.g. @EthosLab')
  .option('--json', 'print output in JSON')
  .option('--show-time', 'include timestamp in output')
  .showHelpAfterError()
  .allowExcessArguments(false)
  .parse()

const channel = program.args[0]
const options = program.opts()

/** @type {Record<string, SupportedBrowser>} */
const browsers  = {
  brave: 'chrome',
  chromium: 'chrome',
  chrome: 'chrome',
  firefox: 'firefox',
}

/** @type {string | undefined} */
let executablePath = undefined
/** @type {import('puppeteer').SupportedBrowser | undefined} */
let browser = undefined

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

let results = await page.$$eval('a.ytLockupMetadataViewModelTitle', (els) => els.map(el => ({
  link: el.href,
  title: el
    .querySelector('span')
    ?.textContent,
  timestamp: el
    .closest('.ytLockupMetadataViewModelTextContainer')
    ?.querySelector('.ytLockupMetadataViewModelMetadata')
    ?.querySelector('span:last-of-type')
    ?.textContent,
})))

if (!results.length) {
  console.error(`No videos found at ${url}`)
  process.exit(1)
}

results.reverse()

if (!options.showTime) {
  results = results.map(r => ({ ...r, timestamp: '[time hidden]' }))
}

if (options.json) {
  console.log(JSON.stringify(results))

} else {
  for (const { link, title, timestamp } of results) {
    console.log(`\x1b]8;;${link}\x1b\\🔗\x1b]8;;\x1b\\ ${title} \x1b[2m• ${timestamp}\x1b[22m`)
  }
}

process.exit(0)
