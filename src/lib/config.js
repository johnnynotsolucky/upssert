import { readJsonFile } from './util/json'

class Config {
  constructor () {
    let config
    try {
      const runcom = readJsonFile(`${process.cwd()}/.upssertrc`).value
      if (runcom) {
        config = runcom
      } else {
        const clientPackage = readJsonFile(`${process.cwd()}/package.json`).value
        if (clientPackage && clientPackage.upssert) {
          config = clientPackage.upssert
        } else {
          config = {}
        }
      }
    } catch (err) {
      config = {}
    }

    this.globOptions = config.globOpts || []
    this.testDir = config.testDir || `${process.cwd()}/test/api/**/*.json`
    this.envPrefix = config.envPrefix || false
    this.unescaped = config.unescaped || false
  }
}

export default Config
