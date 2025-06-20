import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, AuthProvider } from './entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { FindAllUsersQueryDto } from './dto/find-all-users-query.dto';
import { FindManyOptions } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async createFromGoogleProfile(profile: {
    email: string;
    firstName: string;
    lastName: string;
  }) {
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUserDto = {
      email: profile.email,
      name: `${profile.firstName} ${profile.lastName}`,
      password: hashedPassword,
      provider: AuthProvider.GOOGLE,
    };

    const newUser = this.usersRepository.create(newUserDto);
    return this.usersRepository.save(newUser);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async findInactiveUsers() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const inactiveUsers = await this.usersRepository.find({
      where: {
        lastLoginAt: LessThan(thirtyDaysAgo),
      },
    });

    return inactiveUsers.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async findAll(query: FindAllUsersQueryDto) {
    const { role, sortBy, order } = query;

    const options: FindManyOptions<User> = {};


    if (role) {
      options.where = { role };
    }


    if (sortBy) {
      options.order = { [sortBy]: order || 'asc' };
    }

    const users = await this.usersRepository.find(options);

    return users.map((user) => {
      const { password, ...result } = user;
      return result;
    });
  }


  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
    const { password, ...result } = user;
    return result;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.usersRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }

    const savedUser = await this.usersRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuário com o ID "${id}" não encontrado.`);
    }
  }



}