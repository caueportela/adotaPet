import { Test, TestingModule } from '@nestjs/testing';
import { InteresseController } from './interesse.controller';
import { InteresseService } from './interesse.service';

describe('InteresseController', () => {
  let controller: InteresseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InteresseController],
      providers: [InteresseService],
    }).compile();

    controller = module.get<InteresseController>(InteresseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
