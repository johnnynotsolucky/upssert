import fs from 'fs'

export default (file) => {
  let result
  try {
    const fileContents = fs.readFileSync(file)
    const jsonContent = JSON.parse(fileContents)
    result = jsonContent
  } catch (err) {
    result = false
  }
  return result
}
