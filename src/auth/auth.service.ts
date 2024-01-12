import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/app/users/users.entity';
import { UsersService } from 'src/app/users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Gera o token do usuario
   * @param user UserEntity do usuario que está logando
   * @returns token do usuario
   */
  async login(user) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Verifica se o email e a senha estao corretos
   * @param email email do usuario
   * @param password senha do usuario
   * @returns UserEntity do usuario ou null caso não encontre
   */
  async validateUser(email, password) {
    let user: UserEntity;

    try {
      user = await this.usersService.findOneOrFail({ where: { email } });
    } catch (error) {
      return null;
    }

    const isPasswordValid = compareSync(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
