import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    return await this.userRepo.findOne({
      where: { id },
    });
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      throw new HttpException(
        'Usuario o constraña incorrectos.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const areEqual = await bcrypt.compare(password, user.password);

    if (!areEqual) {
      throw new HttpException(
        'Usuario o constraña incorrectos.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async findByPayload({ username }: any): Promise<User> {
    return await this.userRepo.findOne({
      where: { username },
    });
  }

  async create(userDto: CreateUserDto): Promise<User> {
    const { username, password, role } = userDto;

    console.log(role);

    // check if the user exists in the db
    const userInDb = await this.userRepo.findOne({
      where: { username },
    });
    if (userInDb) {
      throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
    }

    const user: User = this.userRepo.create({ username, password, role });

    return this.userRepo.save(user);
  }

  async rolesMatch(role: string, id: string): Promise<boolean> {
    const user = await this.findOne(id);

    return user.role === role;
  }
}
