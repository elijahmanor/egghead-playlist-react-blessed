const fs = require('fs')

const api = {
  readFile(path) {
    if (path) {
      try {
        return fs.readFileSync(path, 'utf-8')
      } catch (exception) {
        return null
      }
    }

    return null
  },
  readJSONFile(path, defaultTextValue = '{}') {
    const content = api.readFile(path) || defaultTextValue
    // console.log('content', { content })
    return JSON.parse(content.trim())
  },
  writeFile(path, content) {
    return fs.writeFileSync(path, content, 'utf-8')
  },
  appendFile(path, content) {
    return fs.appendFileSync(path, content, 'utf-8')
  },
  writeJSONFile(path, content) {
    let indent = '  '
    content = `${JSON.stringify(content, null, indent)}\n`
    return api.writeFile(path, content)
  },
  deleteFile(path) {
    return fs.existsSync(path) ? fs.unlinkSync(path) : Promise.resolve()
  }
}

module.exports = api
