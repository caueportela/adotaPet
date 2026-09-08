import { Test, TestingModule } from '@nestjs/testing';
import { InteresseService } from './interesse.service';

describe('InteresseService', () => {
  let service: InteresseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InteresseService],
    }).compile();

    service = module.get<InteresseService>(InteresseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
