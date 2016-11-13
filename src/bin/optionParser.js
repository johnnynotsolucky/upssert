const argToArray = (arg) => {
  return Array.isArray(arg) ? arg :
    arg ? [arg] : null;
};

const opts = (argv) => {
  const files = argToArray(argv.file || argv.f);
  const dirs = argToArray(argv.dir);
  const globPattern = argToArray(argv.glob || argv.g);
  const help = argv.help || argv.h;
  const version = argv.version;

  return {
    files,
    dirs,
    globPattern,
    help,
    version,
  };
};

export default opts;
