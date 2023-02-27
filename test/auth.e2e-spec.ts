import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth (POST)', () => {
		const email = 't25252asdfasdfasdf@t.com'
    return request(app.getHttpServer())
      .post('/auth/signup')
			.send({ email, password: 'p' })
      .expect(201)
      .then(res => {
				const { id, email } = res.body;
				expect(id).toBeDefined();
				expect(email).toEqual(email)
			})
  });
});