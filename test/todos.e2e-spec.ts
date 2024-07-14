import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Todo>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  it('/todos (POST)', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({ title: 'Test Todo' })
      .expect(302)
      .expect('Location', '/todos');
  });

  it('/todos (GET)', async () => {
    const todo = repository.create({ title: 'Test Todo' });
    await repository.save(todo);

    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('Test Todo');
      });
  });

  it('/todos/:id (PATCH)', async () => {
    const todo = repository.create({ title: 'Test Todo' });
    await repository.save(todo);

    return request(app.getHttpServer())
      .patch(`/todos/${todo.id}`)
      .send({ title: 'Updated Todo' })
      .expect(302)
      .expect('Location', '/todos');
  });

  it('/todos/:id (DELETE)', async () => {
    const todo = repository.create({ title: 'Test Todo' });
    await repository.save(todo);

    return request(app.getHttpServer())
      .delete(`/todos/${todo.id}`)
      .expect(302)
      .expect('Location', '/todos');
  });

  afterAll(async () => {
    await app.close();
  });
});
