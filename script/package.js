const path = require('path')
const packager = require('electron-packager')

const config = require(path.join(__dirname, "..", "package.json"))

const electronVersion = (str) => {
  return str.startsWith ?
    str.substring(1) :
    str
}

const options = {
  dir: path.join(__dirname, "..", "dist"),
  appVersion: config.version,
  arch: 'x64',
  asar: {
    unpackDir: "node_modules/dugite/git", // Git executables need to be outside of asar.
  },
  electronVersion: electronVersion(config.devDependencies.electron),
  icon: path.join(__dirname, "..", "resources", "app.ico"),
  name: config.name,
  out: path.join(__dirname, "..", "package"),
  overwrite: true,
  platform: process.platform,
  win32metadata: {
    FileDescription: config.description,
    OriginalFilename: config.name,
    ProductName: config.name,
    InternalName: config.name
  }
}

packager(options, (err, appPaths) => {
  if (err) {
    throw new Error(err)
  }

  console.log(`packaging successfully finished. written in ${appPaths}`)
})
