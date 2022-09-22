import Mapper from './mapper';
import {BpiSubject} from './bpiSubject';
import { getType, Type, PropertyInfo } from "tst-reflect";

const classType : Type = getType<BpiSubject>();
const classProps = classType.getProperties().filter(prop => prop.accessModifier === 0);
console.log(classProps)

console.log(classType.getConstructors()[0].getParameters())

// const converted = Mapper.convert(undefined, Object.getOwnPropertyNames(BpiSubject));
// console.log(converted)
