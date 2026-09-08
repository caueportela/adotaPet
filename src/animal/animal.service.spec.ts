import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnimalService } from './animal.service.js';
import { Animal, Especie, PorteAnimal, SexoAnimal, StatusAnimal } from './entities/animal.entity.js';
import { CreateAnimalDto } from './dto/create-animal.dto.js';

describe('AnimalService', () => {
  let service: AnimalService;
  const animalRepository = {
    create: vi.fn(),
    save: vi.fn(),
  };

  beforeEach(async () => {
    animalRepository.create.mockReset();
    animalRepository.save.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnimalService,
        {
          provide: getRepositoryToken(Animal),
          useValue: animalRepository,
        },
      ],
    }).compile();

    service = module.get<AnimalService>(AnimalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('cria o animal a partir dos dados recebidos no dto', async () => {
      const dto: CreateAnimalDto = {
        nome: 'Rex',
        especie: Especie.CACHORRO,
        idade: 3,
        sexoAnimal: SexoAnimal.MACHO,
        porte: PorteAnimal.MEDIO,
      };
      const animalCriado = { ...dto, id: 'uuid-1', status: StatusAnimal.DISPONIVEL } as Animal;

      animalRepository.create.mockReturnValue(animalCriado);
      animalRepository.save.mockResolvedValue(animalCriado);

      const resultado = await service.create(dto);

      expect(animalRepository.create).toHaveBeenCalledWith(dto);
      expect(animalRepository.save).toHaveBeenCalledWith(animalCriado);
      expect(resultado).toBe(animalCriado);
    });
  });
});
