export default (milliseconds) => {
  const seconds = milliseconds / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  let result;
  if (hours >= 1) {
    result = `${hours.toFixed(3)}h`;
  } else if (minutes >= 1) {
    result = `${minutes.toFixed(3)}m`;
  } else if (seconds >= 1) {
    result = `${seconds.toFixed(3)}s`;
  } else {
    result = `${milliseconds}ms`;
  }
  return result;
};
