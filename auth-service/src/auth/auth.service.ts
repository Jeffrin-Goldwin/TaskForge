import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hash });
    return this.repo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException();

    const token = this.jwt.sign({ sub: user.id });
    return { token };
  }
}
