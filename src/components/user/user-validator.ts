import { Schema, Validator } from 'jsonschema';
import { User, UserLogin } from '../../interfaces';

const v = new Validator();

const registerSchema: Schema = {
  type: 'object',
  properties: {
    address: { type: 'string', required: true },
    name: { type: 'string', required: true },
    surname: { type: 'string', required: true },
  },
};

const loginSchema: Schema = {
  type: 'object',
  properties: {
    id: { type: 'number', required: true },
  },
};

v.addSchema(registerSchema);
v.addSchema(loginSchema);

export const validateRegisterUserData = (data: User) => {
  return v.validate(data, registerSchema);
};

export const validateLoginUserData = (data: UserLogin) => {
  return v.validate(data, loginSchema);
};
