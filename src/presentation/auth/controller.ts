import { Request, Response } from 'express';
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.service';

export class AuthControlelr {
  constructor(
    public readonly authService: AuthService
  ) {}
  
  private handleError = (error:unknown, res: Response) => {

    if ( error instanceof CustomError) {
      return res.status(error.statusCode).json({error: error.message});
    }

    console.log(error);
    return res.status(500).json({error: 'Internal server Error'});

  }

  registerUser = (req: Request, res: Response) => {

    const [error, registerDto] = RegisterUserDto.create(req.body);

    if(error) return res.status(400).json({error});


    return this.authService.registerUser(registerDto!)
                .then(user => res.json(user))
                .catch((err) => this.handleError(err,res));
  };

  loginUser = (req: Request, res: Response) => {
    return res.json('loginUser');
  };

  validateEmail = (req: Request, res: Response) => {
    return res.json('validateEmail');
  };
}
