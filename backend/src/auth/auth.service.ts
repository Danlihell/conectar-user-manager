import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }


    async login(email: string, pass: string) {
        const user = await this.usersService.findOneByEmail(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            await this.usersService.update(user.id, { lastLoginAt: new Date() });
            const payload = { sub: user.id, username: user.name, role: user.role };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
        throw new UnauthorizedException('Credenciais inválidas');
    }


    async googleLogin(req) {
        if (!req.user) {
            throw new UnauthorizedException('Nenhum usuário do Google encontrado');
        }

  
        let user = await this.usersService.findOneByEmail(req.user.email);

        if (!user) {
            user = await this.usersService.createFromGoogleProfile(req.user);
        }


        await this.usersService.update(user.id, { lastLoginAt: new Date() });
        const payload = { sub: user.id, username: user.name, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}