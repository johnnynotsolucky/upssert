import fs from 'fs';

export default (file) => {
  const fileContents = fs.readFileSync(file);
  const jsonContent = JSON.parse(fileContents);
  return jsonContent;
};
