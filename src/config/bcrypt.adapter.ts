import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

const SALT = 10;

export const bcryptAdapter = {
  hash: (password: string) => {
    const salt = genSaltSync(SALT);
    return hashSync(password, salt);
  },
  compare: (password: string, hashed: string) => {
    return compareSync(password, hashed);
  },
};
