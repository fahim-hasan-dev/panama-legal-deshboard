export const config = {
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000",
  baseURL:
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    (process.env.NEXT_PUBLIC_SERVER_URL
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`
      : "http://localhost:5000/api/v1"),
};

export const SERVER_URL = config.serverURL;
export const BASE_URL = config.baseURL;
