import { program } from 'commander'
import puppeteer from 'puppeteer'

program
  .argument('[regex]', 'regular expression to filter video titles by')
  .requiredOption('-c, --channel <name>', 'YouTube channel name')

program.parse()
const regex = new RegExp(program.args[0] ?? '.*')
const { channel } = program.opts()

const browser = await puppeteer.launch({ browser: 'firefox' })
const page = await browser.newPage()

await page.goto(`https://www.youtube.com/${channel}/videos`)
const results = await page.$$eval('#video-title', (nodes, regex) => nodes
  .filter(e => regex.test(e.textContent))
  .map(e => ({ link: e.parentElement.href, title: e.textContent })),
  regex
)
for (const { link, title } of results) {
  console.log(`\x1b]8;;${link}\x1b\\${title}\x1b]8;;\x1b\\`)
}

await browser.close()
