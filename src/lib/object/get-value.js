import camelcase from 'camelcase';

const getValueFromBracketNotation = (object, property, bracketNotation) => {
  const parentProperty = property.substr(0, property.match(/\[/).index);
  let newObject = object[camelcase(parentProperty)];
  for (const part of bracketNotation) {
    newObject = newObject[part.replace('[', '').replace(']', '')];
  }
  return newObject;
};

const getObjectValue = (object, key) => {
  try {
    let value = object;
    const properties = key.split('.');
    for (const property of properties) {
      const bracketNotation = property.match(/\[(.*?)]/g);
      if (bracketNotation) {
        value = getValueFromBracketNotation(value, property, bracketNotation);
      } else {
        value = value[camelcase(property)];
      }
    }
    return value;
  } catch (err) {
    return null;
  }
};

export default getObjectValue;
