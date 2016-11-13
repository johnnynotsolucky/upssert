import glob from 'glob';
import fs from 'fs';

const opts = (argv) => {
  const help = argv.help || argv.h;
  const version = argv.version;

  const files = [];

  const getClientPackage = () => {
    const clientPackage = require(`${process.cwd()}/package.json`);
    if(clientPackage &&
      clientPackage.upssert) {
        return clientPackage.upssert;
    } else {
      return {};
    }
  };

  const globPattern = (pattern) => {
    const clientPackage = getClientPackage();
    const globOptions = clientPackage.globOpts || [];
    const globbed = glob.sync(pattern, globOptions);
    files.push(...globbed);
  };

  if (argv._.length === 0) {
    const clientPackage = getClientPackage();
    if(clientPackage.testDir) {
      argv._.push(clientPackage.testDir);
    } else {
      argv._.push(`${process.cwd()}/test/**/*.json`);
    }
  }
  argv._.forEach((pattern) => {
    if (!pattern.startsWith('/')) {
      pattern = `${process.cwd()}/${pattern}`;
    }
    let stat;
    try {
      stat = fs.statSync(pattern);
    } catch (err) {
      //noOp
    }
    if (stat && stat.isDirectory()) {
      pattern = `${pattern}/**/*.json`;
    }
    globPattern(pattern);
  });

  return {
    help,
    version,
    files,
  };
};

export default opts;
