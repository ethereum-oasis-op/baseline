import { getType, Type, PropertyInfo, TypeKind } from 'tst-reflect';
import { AccessModifier } from './access-modifiers';

/**
 * Generic mapper to convert object to Type at runtime
 *
 * @author : Manik-Jain
 */
export default class Mapper {
  /**
   * type convert from provided input to provided Type
   * provides capabilities to define some explicit
   * properties on the type
   *
   * Be careful with providing opts obeject as
   * this will change the properties on the type
   *
   * @param from
   * @param classType
   * @param opts
   * @returns generated object
   */
  static map<T>(from: any, classType: Type, opts?: any) {
    if (!from) throw new Error('undefined source');
    console.log(from);

    let result = {};
    let mismatchedKeys = [];
    if (classType.kind === TypeKind.Interface) {
      const keys = classType.getProperties().map((param) => param.name);
      Object.keys(from).forEach((prop) => {
        if (keys.includes(prop)) {
          result[prop] = from[prop];
        } else {
          mismatchedKeys.push(prop);
        }
      });

      if (opts) {
        Object.keys(opts).forEach((prop) => {
          if (keys.includes(prop)) {
            result[prop] = opts[prop];
          } else {
            mismatchedKeys.push(prop);
          }
        });
      }

      console.log(`Type conversion successful`);
      if (mismatchedKeys.length > 0) {
        console.log(
          `Found ${mismatchedKeys.length} mismatched keys => ${mismatchedKeys}`,
        );
      }

      return result;
    } else if (classType.kind === TypeKind.Class) {
      const constructorParams = classType.getConstructors()[0].getParameters();
      const mandatoryParams = constructorParams
        .filter((param) => param.optional === false)
        .map((param) => param.name);

      if (mandatoryParams.length > 0) {
        Object.keys(from).forEach((prop) => {
          if (mandatoryParams.includes(prop)) {
            result[prop] = from[prop];
          } else {
            mismatchedKeys.push(prop);
          }
        });
      }

      if (opts) {
        const classProps = classType
          .getProperties()
          .filter(
            (prop) =>
              prop.accessModifier === AccessModifier.Private ||
              prop.accessModifier === AccessModifier.Public ||
              prop.accessModifier === AccessModifier.Protected,
          )
          .map((param) => param.name);
        Object.keys(opts).forEach((prop) => {
          if (classProps.includes(prop)) {
            result[prop] = opts[prop];
          } else {
            mismatchedKeys.push(prop);
          }
        });
      }
    }

    console.log(`Type conversion successful`);
    if (mismatchedKeys.length > 0) {
      console.log(
        `Found ${mismatchedKeys.length} mismatched keys => ${mismatchedKeys}`,
      );
    }
    return result;
  }
}
