export default (): IAppConfiguration => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    type: (process.env.DB_TYPE as DBType) || DBType.postgres,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    endpointId: process.env.DB_ENDPOINT_ID,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
});

export enum DBType {
  postgres = 'postgres',
  mysql = 'mysql',
}

export interface IAppConfiguration {
  port: number;
  database: DBConfig;
  auth: AuthConfig;
}

export interface DBConfig {
  host: string;
  port: number;
  type: DBType;
  database: string;
  username: string;
  password: string;
  endpointId: string;
}

export interface AuthConfig {
  jwtSecret: string;
}
