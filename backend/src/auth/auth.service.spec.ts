import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/users/entities/user.entity';

const mockUser = {
    id: 'some-uuid',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: UserRole.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
};

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: Partial<UsersService>;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        findOneByEmail: jest.fn().mockResolvedValue(mockUser),
                        update: jest.fn().mockResolvedValue(undefined),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mock-jwt-token'),
                    },
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('login', () => {
        it('should return an access token on successful login', async () => {
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

            const result = await authService.login(mockUser.email, 'correct-password');

            expect(result).toHaveProperty('access_token');
            expect(result.access_token).toBe('mock-jwt-token');
            expect(jwtService.sign).toHaveBeenCalledWith({
                sub: mockUser.id,
                username: mockUser.name,
                role: mockUser.role,
            });
        });

        it('should throw UnauthorizedException for wrong password', async () => {
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
            await expect(authService.login(mockUser.email, 'wrong-password')).rejects.toThrow(UnauthorizedException);
        });
    });
});