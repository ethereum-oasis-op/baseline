import {
  Baseline,
  Ident,
}                   from 'provide-js';
import { tryTimes } from '../src/utils';

export class StackHelper {

  async requireBaseline(
    baselineApiScheme,
    baselineApiHost,
  ): Promise<boolean> {

    return await tryTimes(
      async() => {

        const status = await Baseline.fetchStatus(
          baselineApiScheme,
          baselineApiHost,
        );

        if (status != null) { return true; }

        throw new Error();
      },
      120,
      5000,
    );
  }

  async requireIdent(
    identApiScheme,
    identApiHost,
  ): Promise<boolean> {

    return await tryTimes(
      async() => {

        const status = await Ident.fetchStatus(
          identApiScheme,
          identApiHost,
        );

        if (status != null) { return true; }

        throw new Error();
      },
      120,
      5000,
    );
  }

}
