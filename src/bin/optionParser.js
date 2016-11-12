const argToArray = (arg) => {
  return Array.isArray(arg) ? arg :
    arg ? [arg] : null;
};

const opts = (argv) => {
  const files = argToArray(argv.file || argv.f);
  const dirs = argToArray(argv.dir);
  const help = argv.help || argv.h;
  const version = argv.version;

  return {
    files,
    dirs,
    help,
    version,
  };
};

export default opts;
