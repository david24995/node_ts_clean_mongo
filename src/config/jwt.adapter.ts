import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
  static generateToken(
    payload: { [key: string]: any },
    duration: string = '2h'
  ) {
    return new Promise((resolve) => {
      jwt.sign(
        payload,
        JWT_SEED,
        { expiresIn: duration as any },
        (err, token) => {
          if (err) return resolve(null);

          return resolve(token);
        }
      );
    });
  }

  static validateToken(token: string) {
    throw 'Not implemented!';
  }
}
