import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import Mapper from '../mapper';
import { TypeClass } from './typeClass';
import { getType } from 'tst-reflect';
import {TypeInterface} from './typeInterface';

describe('Mapper', () => {
  let mapper: Mapper;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [],
      providers: [
        Mapper,
      ],
    })
    .compile();

    mapper = app.get<Mapper>(Mapper);

    await app.init();
  });

  describe('map', () => {    

    it('maps from class type to interface', async () => {
      const input: TypeClass = new TypeClass(
        '1',
        'name',
        'description',
        'publicKey',
      )

      const mapped : TypeInterface = mapper.map(input, getType<TypeInterface>()) as TypeInterface;

      //expected
      const expected : TypeInterface = {id:'1', name: 'name', description: 'description', publicKey: 'publicKey'}

      // Assert
      expect(mapped).toEqual(expected);
    });

    it('maps from interface type to class', async () => {

      const input : TypeInterface = {id:'1', name: 'name', description: 'description', publicKey: 'publicKey'}

      const mapped : TypeClass = mapper.map(input, getType<TypeClass>()) as TypeClass;      
      
      //expected
      const expected = {id:'1', name: 'name', description: 'description', publicKey: 'publicKey'}

      // Assert
      expect(mapped).toEqual(expected);
    });
  });
});
