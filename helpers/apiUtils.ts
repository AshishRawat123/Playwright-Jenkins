import { APIRequestContext, request } from "@playwright/test";

export async function apiRequest(
    request: APIRequestContext,
    method: string,
    url: string,
    options: any = {}){

    const start = Date.now();

    const respone = await request.fetch(url,
        {
            method:method,
            headers: options.headers,
            data: options.body
        }
    );
    return {
        respone,
        responseTime : Date.now()-start
    }
}

export async function defaultGetRequest(
    request: APIRequestContext,
    url: string,
    options: any = {}){

    const start = Date.now();

    const respone = await request.fetch(url,
        {
            method:'get',
            headers: options.headers,
            data: options.body
        }
    );
    return {
        respone,
        responseTime : Date.now()-start
    }
}

