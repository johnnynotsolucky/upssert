import glob from 'glob';
import fs from 'fs';
import Config from '../lib/config';

const opts = (argv) => {
  const config = new Config();
  const help = argv.help || argv.h;
  const version = argv.version;
  const url = argv.url;
  const reporter = argv.reporter || argv.r || 'console';

  const files = [];

  const globPattern = (pattern) => {
    const globbed = glob.sync(pattern, config.globOptions);
    files.push(...globbed);
  };

  if (argv._.length === 0) {
    argv._.push(config.testDir);
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
