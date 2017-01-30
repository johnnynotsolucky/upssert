const envVariables = (config) => {
  let env = {}
  if (config.envPrefix) {
    Object.keys(process.env)
      .filter(key => key.indexOf(config.envPrefix) === 0)
      .forEach((key) => {
        env[key] = process.env[key]
      })
  } else {
    env = {
      ...process.env
    }
  }
  return env
}

export default (config) => {
  const env = envVariables(config)
  return {
    env
  }
}
