import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { TestingModule, Test } from '@nestjs/testing';
import { getConnection } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await getConnection().close();
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('user');
      });
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
        })
        .expect(302)
        .expect('Location', '/auth/login');
    });
  });

  describe('/auth/login (POST)', () => {
    it('should log in a user and set JWT cookie', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'password',
          name: 'Test User',
        })
        .expect(302);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test2@example.com', password: 'password' })
        .expect(302)
        .expect('Location', '/')
        .expect('Set-Cookie', /jwt/);
    });
  });

  describe('/todos (GET, POST)', () => {
    let jwtToken: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'test2@example.com', password: 'password' })
        .expect(302);

      jwtToken = res.header['set-cookie'][0];
    });

    it('should get todos', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .set('Cookie', jwtToken)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(expect.any(Array));
        });
    });

    it('should create a new todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .set('Cookie', jwtToken)
        .send({ title: 'New Todo' })
        .expect(302)
        .expect('Location', '/todos');
    });
  });
});
