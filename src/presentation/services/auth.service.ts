import { bcryptAdapter, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import {
  CustomError,
  LoginUserDto,
  RegisterUserDto,
  UserEntity,
} from '../../domain';

export class AuthService {
  constructor() {}

  public async registerUser(registerDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerDto.email });

    if (existUser) throw CustomError.badRequest('Email already exist');

    try {
      const user = new UserModel(registerDto);

      // TODO: Encriptar la constraseña
      user.password = bcryptAdapter.hash(registerDto.password);

      await user.save();

      // TODO: JWT <----- para mantener la autenticación del usuario

      // TODO: Email de confirmación

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: 'ABC',
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
}
