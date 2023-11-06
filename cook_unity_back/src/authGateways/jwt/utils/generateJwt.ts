import * as jwt from 'jsonwebtoken';

export default (
  secret: string,
  payload: Object,
  provider: string = 'local',
  lifespan: string | number = '1h',
) => {
  // Return signed JWT
  return jwt.sign({ ...payload, provider }, secret, {
    expiresIn: lifespan,
  });
};
