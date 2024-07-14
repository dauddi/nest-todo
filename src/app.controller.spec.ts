import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { Request } from 'express';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return user if jwt cookie is present', () => {
      const req = {
        cookies: { jwt: 'some-jwt-token' },
      } as Partial<Request> as Request;
      expect(appController.root(req)).toEqual({ user: 'some-jwt-token' });
    });

    it('should return null if jwt cookie is not present', () => {
      const req = { cookies: {} } as Partial<Request> as Request;
      expect(appController.root(req)).toEqual({ user: null });
    });
  });
});
