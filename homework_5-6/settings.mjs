import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory
console.log('__dirname')
console.log(__dirname)
const filePath = path.join(__dirname, '/data/carsData.json')

console.log('filePath')
console.log(filePath)

export default {
  dataFilePath: filePath,
  //  '/data/carsData.json',
}
