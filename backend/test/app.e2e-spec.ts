import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Viral Master Backend (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('AppController', () => {
    it('GET /api should return hello message', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data).toBe('Hello from Viral Master Backend!');
          expect(res.body.message).toBe('Success');
        });
    });

    it('GET /api/health should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data.status).toBe('ok');
          expect(res.body.data.timestamp).toBeDefined();
        });
    });
  });

  describe('ChatController', () => {
    let sessionId: string;

    it('POST /api/chat/sessions should create a session', () => {
      return request(app.getHttpServer())
        .post('/api/chat/sessions')
        .send({ title: 'Test Session' })
        .expect(201)
        .expect((res) => {
          expect(res.body.code).toBe(201);
          expect(res.body.data.title).toBe('Test Session');
          expect(res.body.data.id).toBeDefined();
          sessionId = res.body.data.id;
        });
    });

    it('GET /api/chat/sessions should list sessions', () => {
      return request(app.getHttpServer())
        .get('/api/chat/sessions')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('GET /api/chat/sessions/:id should get session by id', () => {
      return request(app.getHttpServer())
        .get(`/api/chat/sessions/${sessionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data.id).toBe(sessionId);
        });
    });
  });

  describe('CharacterController', () => {
    let characterId: string;

    it('POST /api/characters should create a character', () => {
      return request(app.getHttpServer())
        .post('/api/characters')
        .send({ name: 'Test Character', personality: 'Friendly' })
        .expect(201)
        .expect((res) => {
          expect(res.body.code).toBe(201);
          expect(res.body.data.name).toBe('Test Character');
          characterId = res.body.data.id;
        });
    });

    it('GET /api/characters should list characters', () => {
      return request(app.getHttpServer())
        .get('/api/characters')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('GET /api/characters/:id should get character by id', () => {
      return request(app.getHttpServer())
        .get(`/api/characters/${characterId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data.id).toBe(characterId);
        });
    });
  });

  describe('MaterialController', () => {
    let materialId: string;

    it('POST /api/materials should create a material', () => {
      return request(app.getHttpServer())
        .post('/api/materials')
        .send({
          type: 'image',
          fileName: 'test.png',
          originalName: 'test.png',
          mimeType: 'image/png',
          size: 1024,
          url: '/uploads/test.png',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.code).toBe(201);
          expect(res.body.data.fileName).toBe('test.png');
          materialId = res.body.data.id;
        });
    });

    it('GET /api/materials should list materials', () => {
      return request(app.getHttpServer())
        .get('/api/materials')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('VideoTaskController', () => {
    let taskId: string;

    it('POST /api/video-tasks should create a video task', () => {
      return request(app.getHttpServer())
        .post('/api/video-tasks')
        .send({
          type: 'text_to_video',
          prompt: 'A cat walking on a beach',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.code).toBe(201);
          expect(res.body.data.prompt).toBe('A cat walking on a beach');
          taskId = res.body.data.id;
        });
    });

    it('GET /api/video-tasks should list video tasks', () => {
      return request(app.getHttpServer())
        .get('/api/video-tasks')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('WorkspaceController', () => {
    let workspaceId: string;

    it('POST /api/workspaces should create a workspace', () => {
      return request(app.getHttpServer())
        .post('/api/workspaces')
        .send({ name: 'Test Workspace' })
        .expect(201)
        .expect((res) => {
          expect(res.body.code).toBe(201);
          expect(res.body.data.name).toBe('Test Workspace');
          workspaceId = res.body.data.id;
        });
    });

    it('GET /api/workspaces should list workspaces', () => {
      return request(app.getHttpServer())
        .get('/api/workspaces')
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('DELETE /api/workspaces/:id should delete workspace', () => {
      return request(app.getHttpServer())
        .delete(`/api/workspaces/${workspaceId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
        });
    });
  });

  describe('CreditController', () => {
    const userId = 'test-user-123';

    it('GET /api/credits/:userId should get or create credit account', () => {
      return request(app.getHttpServer())
        .get(`/api/credits/${userId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data.userId).toBe(userId);
          expect(res.body.data.balance).toBe(0);
        });
    });

    it('POST /api/credits/:userId/add should add credits', () => {
      return request(app.getHttpServer())
        .post(`/api/credits/${userId}/add`)
        .send({ amount: 100, description: 'Initial top-up' })
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data.amount).toBe(100);
        });
    });

    it('POST /api/credits/:userId/deduct should deduct credits', () => {
      return request(app.getHttpServer())
        .post(`/api/credits/${userId}/deduct`)
        .send({ amount: 30, description: 'Video generation' })
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data.amount).toBe(-30);
        });
    });

    it('GET /api/credits/:userId/transactions should list transactions', () => {
      return request(app.getHttpServer())
        .get(`/api/credits/${userId}/transactions`)
        .expect(200)
        .expect((res) => {
          expect(res.body.code).toBe(200);
          expect(res.body.data.items).toBeDefined();
          expect(res.body.data.total).toBe(2);
        });
    });
  });
});
