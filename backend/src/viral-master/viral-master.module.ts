import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SseStreamService } from '../common/sse/sse-stream.service';

// Controllers
import { ChatController } from './controllers/chat.controller';
import { CharacterController } from './controllers/character.controller';
import { MaterialController } from './controllers/material.controller';
import { VideoController } from './controllers/video.controller';
import { WorkspaceController } from './controllers/workspace.controller';

// Services
import { ChatService } from './services/chat.service';
import { CharacterService } from './services/character.service';
import { MaterialService } from './services/material.service';
import { VideoTaskService } from './services/video-task.service';
import { WorkspaceService } from './services/workspace.service';

// Providers
import { SeedanceProvider } from './providers/seedance.provider';

// SSE
import { ChatSseHandler } from './sse/chat-sse.handler';

const controllers = [
  ChatController,
  CharacterController,
  MaterialController,
  VideoController,
  WorkspaceController,
];

const services = [
  ChatService,
  CharacterService,
  MaterialService,
  VideoTaskService,
  WorkspaceService,
  SseStreamService,
  ChatSseHandler,
];

const providers = [
  SeedanceProvider,
];

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers,
  providers: [
    ...services,
    ...providers,
  ],
  exports: [
    ...services,
  ],
})
export class ViralMasterModule {
  constructor(
    private readonly videoTaskService: VideoTaskService,
    private readonly seedanceProvider: SeedanceProvider,
  ) {
    // Register the Seedance provider with the video task service
    this.videoTaskService.registerProvider(this.seedanceProvider);
  }
}
