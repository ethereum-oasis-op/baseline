import { Type, TypeKind } from 'tst-reflect';
import { AccessModifier } from './types/access-modifiers';
import Options from './types/options';

/**
 * Generic mapper to convert object to Type at runtime
 *
 * @author : Manik-Jain
 */
export default class Mapper {
  /**
   * type convert from provided input to provided Type
   * provides capabilities to define some explicit
   * keyerties on the type
   *
   * Be careful with providing options object as
   * this will change the keyerties on the type
   *
   * @param from
   * @param object
   * @param options
   * @returns generated object
   */
  static map(from: any, object: Type, options?: Options) {
    if (!from) throw new Error('undefined source');    
    const supportedPrefix = ['$', '_']

    const result = {};
    const mismatchedKeys = [];
    if (object.kind === TypeKind.Interface) {
      const targetTypeKeys = object.getProperties().map((param) => param.name);
      Object.keys(from).forEach((key) => {
        if (targetTypeKeys.includes(key) && !options?.exclude?.includes(key)) {
          result[key] = from[key];
        } else {
          mismatchedKeys.push(key);
        }
      });

      if (options?.opts) {
        const opts = options.opts
        Object.keys(opts).forEach((key) => {
          if (targetTypeKeys.includes(key) && !options?.exclude?.includes(key)) {
            result[key] = opts[key];
          } else {
            mismatchedKeys.push(key);
          }
        });
      }

      console.log(`Type conversion successful to ${object.name}`);
      if (mismatchedKeys.length > 0) {
        console.log(
          `Found ${mismatchedKeys.length} mismatched keys => ${mismatchedKeys}`,
        );
      }

      return result;
    } else if (object.kind === TypeKind.Class) {
      const constructorParams = object.getConstructors()[0].getParameters();
      const classProperties = object.getProperties().filter(property => property.accessModifier === 2).map(property => property.name)
      const mandatoryParams = constructorParams
        .filter((param) => param.optional === false)
        .map((param) => param.name);

      if (mandatoryParams.length > 0) {
        Object.keys(from).forEach((key) => {
          if(supportedPrefix.includes(key.charAt(0))) {
            const objectKey = key.substring(1, key.length)
            if (mandatoryParams.includes(objectKey) && classProperties.includes(objectKey) && !options?.exclude?.includes(objectKey)) {
              result[objectKey] = from[key];
            } else {
              mismatchedKeys.push(key);
            }
          } else {
            if (mandatoryParams.includes(key) && !options?.exclude?.includes(key)) {
              result[key] = from[key];
            } else {
              mismatchedKeys.push(key);
            }
          }
        });
      }

      if (options?.opts) {
        const classkeys = object
          .getProperties()
          .filter(
            (key) =>
              key.accessModifier === AccessModifier.Private ||
              key.accessModifier === AccessModifier.Public ||
              key.accessModifier === AccessModifier.Protected,
          )
          .map((param) => param.name);
        Object.keys(options.opts).forEach((key) => {
          if (classkeys.includes(key) && !options?.exclude?.includes(key)) {
            result[key] = options[key];
          } else {
            mismatchedKeys.push(key);
          }
        });
      }
    }

    console.log(`Type conversion successful to ${object.name}`);
    if (mismatchedKeys.length > 0) {
      console.log(
        `Found ${mismatchedKeys.length} mismatched keys => ${mismatchedKeys}`,
      );
    }
    return result;
  }
}
