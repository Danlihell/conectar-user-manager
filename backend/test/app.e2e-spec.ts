import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();


    const adminLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'login@email.com', password: 'minhasenha123' });
    adminToken = adminLoginResponse.body.access_token;

    const userLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'danilo@gmail.com', password: 'senhaforte123' });
    userToken = userLoginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) - Health Check', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  describe('/users Endpoint', () => {
    it('(GET) should return 401 Unauthorized without a token', () => {
      return request(app.getHttpServer()).get('/users').expect(401);
    });

    it('(GET) should return 403 Forbidden for a non-admin user', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('(GET) should return 200 OK and a list of users for an admin', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body[0]).toHaveProperty('id');
          expect(response.body[0]).not.toHaveProperty('password');
        });
    });
  });


  describe('Admin Actions on /users (e2e)', () => {
    let createdUser;


    beforeEach(async () => {
      const uniqueEmail = `delete-me-${Date.now()}@test.com`;
      const createUserResponse = await request(app.getHttpServer())
        .post('/users')
        .send({ name: 'User to be Deleted', email: uniqueEmail, password: 'password' });

      createdUser = createUserResponse.body;
    });

    it('(DELETE) /users/:id - should allow an admin to delete a user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);
    });

    it('(DELETE) /users/:id - should return 403 Forbidden for a non-admin user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${createdUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});