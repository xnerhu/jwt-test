import { createConnection, EntitySchema } from 'typeorm';

import { config } from '../../constants';

export const createTypeormConnection = (
  entities: (string | Function | EntitySchema<any>)[],
) => {
  return createConnection({
    ...{ ...config.typeorm },
    entities,
  });
};
