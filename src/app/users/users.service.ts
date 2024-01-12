import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Irá trazer uma lista com todos os usuarios registrados
   * @returns uma lista de usuarios
   */
  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'firstName', 'lastName', 'email', 'createdAt'],
    });
  }

  /**
   * Irá trazer uma lista com o usuario desejado baseado no filtro
   * @param options filtro que deseja aplicar, exemplo: { where: { id } }
   * @returns uma lista de usuarios ou erro NotFoundException
   */
  async findOneOrFail(options: FindOneOptions<UserEntity>) {
    try {
      return await this.userRepository.findOneOrFail(options);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  /**
   * cria um usuario
   * @param data CreateUserDto do usuario a ser criado
   * @returns usuario cadastrado
   */
  async create(data: CreateUserDto) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  /**
   * Atualiza os dados de um usuario
   * @param id id do usuario a ser atualizado
   * @param updatedUser novos dados do usuario
   * @returns a entidade atualizada
   */
  async update(id: number, updatedUser: UpdateUserDto) {
    const userExist = await this.findOneOrFail({ where: { id } });
    this.userRepository.merge(userExist, updatedUser);
    return await this.userRepository.save(userExist);
  }

  /**
   * Faz um softDelete do usuario
   * @param id id do usuario a ser deletado
   */
  async delete(id: number) {
    await this.findOneOrFail({ where: { id } });
    this.userRepository.softDelete({ id });
  }
}
