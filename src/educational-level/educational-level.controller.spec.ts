import { Test, TestingModule } from '@nestjs/testing';
import { EducationalLevelController } from './educational-level.controller';

describe('EducationalLevel Controller', () => {
  let controller: EducationalLevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationalLevelController],
    }).compile();

    controller = module.get<EducationalLevelController>(EducationalLevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
