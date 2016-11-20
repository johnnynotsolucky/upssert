import glob from 'glob';
import fs from 'fs';
import readJsonFile from './read-json-file';

const opts = (argv) => {
  const help = argv.help || argv.h;
  const version = argv.version;
  const url = argv.url;
  const reporter = argv.reporter || argv.r || 'console';

  const files = [];

  const getClientPackage = () => {
    let result = {};
    const clientPackage = readJsonFile(`${process.cwd()}/package.json`);
    if (clientPackage && clientPackage.upssert) {
      result = clientPackage.upssert;
    }
    return result;
  };

  const globPattern = (pattern) => {
    const clientPackage = getClientPackage();
    const globOptions = clientPackage.globOpts || [];
    const globbed = glob.sync(pattern, globOptions);
    files.push(...globbed);
  };

  if (argv._.length === 0) {
    const clientPackage = getClientPackage();
    if (clientPackage.testDir) {
      argv._.push(clientPackage.testDir);
    } else {
      argv._.push(`${process.cwd()}/test/api/*.json`);
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
      // noOp
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
    url,
    reporter,
  };
};

export default opts;
