export type TokenType = 'ACCESS_TOKEN' | 'REFRESH_TOKEN';

export interface Token {
  type: TokenType;
  data: TokenPayload;
}

export type TokenPayload = {
  userId: number;
};
