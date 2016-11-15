import crypto from 'crypto';

export default () => {
  const hash = crypto.createHash('sha256');
  hash.update(crypto.randomBytes(64));
  const digest = hash.digest('hex');
  return digest;
};
