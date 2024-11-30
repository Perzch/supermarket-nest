import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    ){}

    async signUp(signUpDto: SignUpDto) {
        const user = this.userRepository.create(signUpDto);
        return await this.userRepository.save(user);
    }

    async signIn(signInDto: SignInDto) {
        const user = await this.userRepository.findOne({
            where: {
                username: signInDto.username,
                password: signInDto.password
            }
        });

        if (!user) {
            throw new Error('用户名或密码错误');
        }

        const payload = {
            sub: user.id,
            username: user.username,
        };

        return this.jwtService.sign(payload);
    }
}
