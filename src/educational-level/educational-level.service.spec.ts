import { Test, TestingModule } from '@nestjs/testing';
import { EducationalLevelService } from './educational-level.service';

describe('EducationalLevelService', () => {
  let service: EducationalLevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationalLevelService],
    }).compile();

    service = module.get<EducationalLevelService>(EducationalLevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
