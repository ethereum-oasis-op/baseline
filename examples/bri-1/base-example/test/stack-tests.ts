import { assert }      from 'chai';
import { StackHelper } from './stack-helper';

export const shouldConnectToIdent = (
  identScheme: string,
  identHost: string,
): void => {

  describe('Ident Status', () => {

    it('should have access to Ident service', async() => {
      const stackHelper: StackHelper = new StackHelper();

      const ready: boolean = await stackHelper.requireIdent(
        identScheme,
        identHost,
      );

      assert(ready, 'Ident service must be available');
    });

  });

};

export const shouldConnectToBaseline = (
  baselineScheme: string,
  baselineHost: string,
): void => {

  describe('Baseline Status', () => {

    it('should have access to Baseline service', async() => {
      const stackHelper: StackHelper = new StackHelper();

      const ready: boolean = await stackHelper.requireBaseline(
        baselineScheme,
        baselineHost,
      );

      assert(ready, 'Baseline service must be available');
    });

  });

};
