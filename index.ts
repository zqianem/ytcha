import { program } from 'commander'
import puppeteer from 'puppeteer'
import which from 'which'

program
  .argument('<channel>', 'YouTube channel name, e.g. @EthosLab')
  .option('--browser <binary>', 'binary name of headless browser to use, e.g. firefox')
program.showHelpAfterError();
program.allowExcessArguments(false)
program.parse()
const options = program.opts()

const executablePath = options.browser
  ? await which(options.browser)
    .catch(() => undefined)
  : await which('brave')
    .catch(() => which('chromium'))
    .catch(() => which('chrome'))
    .catch(() => which('firefox'))
    .catch(() => undefined)

if (!executablePath) {
  console.error(options.browser
    ? `Browser '${options.browser}' not found`
    : `Install Firefox or Chrome or use option '--browser'`)
  process.exit(1)
}

const browser = await puppeteer.launch({
  browser: executablePath.includes('fox') ? 'firefox' : 'chrome',
  executablePath
})
const page = await browser.newPage()

const url = `https://www.youtube.com/${program.args[0]}/videos`
await page.goto(url)
const results = await page.$$eval('a#video-title-link', (els) => els.map(el => ({
  link: el.href,
  title: el.querySelector('#video-title')?.textContent
})))

if (!results.length) {
  console.error(`No videos found at ${url}`)
  process.exit(1)
}

for (const { link, title } of results.reverse()) {
  console.log(`[\x1b]8;;${link}\x1b\\Link\x1b]8;;\x1b\\] ${title}`)
}

await browser.close()
