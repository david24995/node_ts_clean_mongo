import { bcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerDto.email });

    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerDto);

      // TODO: Encriptar la constraseña
      user.password = bcryptAdapter.hash(registerDto.password);

      await user.save();

      // TODO: JWT <----- para mantener la autenticación del usuario
      const token = await JwtAdapter.generateToken({
        id: user.id,
      });

      if (!token) throw CustomError.internalServer('Error while creating JWT');

      // TODO: Email de confirmación
      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginDto: LoginUserDto) {
    const existUser = await UserModel.findOne({ email: loginDto.email });
    if (!existUser) throw CustomError.badRequest('Email is not exist');

    if (!bcryptAdapter.compare(loginDto.password, existUser.password))
      throw CustomError.badRequest('Password is wrong');

    // if (!existUser.emailValidated)
    //   throw CustomError.badRequest('Email address is not validated');

    const { password, ...userEntity } = UserEntity.fromObject(existUser);

    const token = await JwtAdapter.generateToken({
      id: userEntity.id,
      email: userEntity.email,
    });

    if (!token) throw CustomError.internalServer('Error while creating JWT');

    return {
      user: userEntity,
      token,
    };
  }

  private sendEmailValidationLink = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer('Error getting token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <h1>Validate your email</h1>
      <p>Click on the following link to validate your email</p>
      <a href="${link}">Validate your email</a>
    `;

    const options = {
      to: email,
      subject: 'Validate your email',
      htmlBody: html,
    };

    const isSet = await this.emailService.sendEmail(options);

    if (!isSet) throw CustomError.internalServer('Error sending email');

    return true;
  };

  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);

    if (!payload) throw CustomError.unauthorize('Invalid Token');

    const { email } = payload as { email: string };

    if (!email) throw CustomError.internalServer('Email not in token');

    const user = await UserModel.findOne({ email });

    if (!user) throw CustomError.internalServer('Email not exist');

    user.emailValidated = true;
    await user.save();

    return true;
  };
}
