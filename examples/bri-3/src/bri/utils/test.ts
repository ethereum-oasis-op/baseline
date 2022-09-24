import Mapper from './mapper';
import {BpiSubject} from './bpiSubject';
import { getType, Type, PropertyInfo } from "tst-reflect";
import { BpiSubjectDto } from './bpiSubject.dto';
import { CreateBpiSubjectCommand } from './createBpiSubject.command';

const classType : Type = getType<CreateBpiSubjectCommand>();
console.log(classType);

// const from = {
//     id : 1,
//       name : 'manik',
//       description : 'Manik',
//       publicKey : '0x234',
// }

// const converted : BpiSubjectDto = Mapper.map(from, getType<BpiSubjectDto>(), {_id : '123'}) as BpiSubjectDto;
// console.log(converted)
