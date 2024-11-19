// src/config.ts

interface Config {
  BASE_URL: string;
}

const devConfig: Config = {
  BASE_URL: 'https://k11e203.p.ssafy.io:8080/api/v1',
};

const prodConfig: Config = {
  BASE_URL: 'https://k11e203.p.ssafy.io:8080/api/v1',
};

const config: Config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;
