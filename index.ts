import { program } from 'commander'
import puppeteer from 'puppeteer'
import which from 'which'

program.argument('<channel>', 'YouTube channel name, e.g. @EthosLab')
program.showHelpAfterError();
program.allowExcessArguments(false)
program.parse()
const channel = program.args[0]

let executablePath: string
try {
  executablePath = await which('firefox')
} catch {
  console.error('Firefox is required but not installed')
  process.exit(1)
}

const browser = await puppeteer.launch({ browser: 'firefox', executablePath })
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

for (const { link, title } of results.reverse()) {
  console.log(`[\x1b]8;;${link}\x1b\\Link\x1b]8;;\x1b\\] ${title}`)
}

await browser.close()
