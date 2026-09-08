import { APIRequestContext } from "@playwright/test";
import chalk from "chalk";

export async function apiRequest(
  request: APIRequestContext,
  method: string,
  url: string,
  options: any = {},
) {
  console.log("=*=*=*=*=*=*=*=*=*=* API REQUEST =*=*=*=*=*=*=*=*=*=*");
  console.log(chalk.green("Method :"), method);
  console.log(chalk.green("URL :"), url);
  console.log(chalk.yellow("Header : "), maskSensitiveHeader(options.header));
  console.log(chalk.yellow("body : "), maskSensitiveHeader(options.body));

  const start = Date.now();
  const respone = await request.fetch(url, {
    method: method,
    headers: options.headers,
    data: options.body,
  });
  const time = Date.now() - start;
  console.log("=*=*=*=*=*=*=*=*=*=* API RESPONSE =*=*=*=*=*=*=*=*=*=*");
  console.log(chalk.red("status : "), respone.status());
  console.log(chalk.yellow("response body : "), await respone.text());
  return {
    respone,
    responseTime: time,
  };
}

export async function defaultGetRequest(
  request: APIRequestContext,
  url: string,
  options: any = {},
) {
  console.log("=*=*=*=*=*=*=*=*=*=* API REQUEST =*=*=*=*=*=*=*=*=*=*");
  console.log(chalk.green("URL :"), url);
  const start = Date.now();
  const respone = await request.fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      ...options.header,
    },
    data: options.body,
  });
  console.log("=*=*=*=*=*=*=*=*=*=* API RESPONSE =*=*=*=*=*=*=*=*=*=*");
  console.log(chalk.red("status : "), respone.status());
  console.log(chalk.yellow("response body : "), await respone.text());
  return {
    respone,
    responseTime: Date.now() - start,
  };
}

function maskSensitiveHeader(header: any) {
  const sensitiveKeys = [
    "Cookie",
    "token",
    "api-key",
    "Authorization",
    "Bearer",
    "password"
  ];
  const copyMasked = { ...header };
  for (const key of Object.keys(copyMasked)) {
    // Either property or its key contains any of the sensitive keys . mask it
    if (
      sensitiveKeys.includes(key) ||
      sensitiveKeys.includes(copyMasked[key])
    ) {
      copyMasked[key] = "*******";
    }
  }
  return copyMasked;
}
