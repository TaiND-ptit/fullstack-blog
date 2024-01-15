import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { promises } from 'dns';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUser(query: FilterUserDto): Promise<any> {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1) * limit;
    const keyword = query.search || '';
    const [res, total] = await this.userRepository.findAndCount({
      where: [
        { first_name: Like('%' + keyword + '%') },
        { last_name: Like('%' + keyword + '%') },
        { email: Like('%' + keyword + '%') },
        // { first_name: Like('%' + keyword + '%') },
      ],
      order: { created_at: 'DESC' },
      take: limit,
      skip: skip,
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
    });
    const lastPage = Math.ceil(total / limit);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data: res,
      total,
      currentPage: page,
      nextPage,
      lastPage,
      prevPage,
    };
  }

  async getUser(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async createUser(createUser: CreateUserDto): Promise<User> {
    return await this.userRepository.save(createUser);
  }

  async updateUser(
    id: number,
    updateUser: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUser);
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar });
  }
  private hashPassword = (password: string): Promise<string> => {
    const hash = bcrypt.hash(password, bcrypt.genSaltSync(10));
    return hash;
  };
}
