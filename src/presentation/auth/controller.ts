import { Request, Response } from 'express';

export class AuthControlelr {
  constructor() {}

  registerUser = (req: Request, res: Response) => {
    return res.json('RegisterUser');
  };

  loginUser = (req: Request, res: Response) => {
    return res.json('loginUser');
  };

  validateEmail = (req: Request, res: Response) => {
    return res.json('validateEmail');
  };
}
