import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {

  constructor(){}

  public async registerUser(registerDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({email: registerDto.email});

    if(existUser) throw CustomError.badRequest('Email already exist');

    try {
      
      const user = new UserModel(registerDto);
      await user.save();

      // TODO: Encriptar la constraseña

      // TODO: JWT <----- para mantener la autenticación del usuario

      // TODO: Email de confirmación

      const {password, ...userEntity} = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: 'ABC'
      };

    } catch (error) {

      throw CustomError.internalServer(`${error}`);

    }

  }

}