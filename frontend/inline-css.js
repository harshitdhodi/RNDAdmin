// inline-css.js
import fs from 'fs'
import Critters from 'critters'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const critters = new Critters({
  path: path.join(__dirname, 'dist'),
  publicPath: '/',
  logLevel: 'info'
})

const html = fs.readFileSync('./dist/index.html', 'utf8')
critters.process(html).then((inlined) => {
  fs.writeFileSync('./dist/index.html', inlined)
  console.log('✅ Critical CSS inlined')
})
