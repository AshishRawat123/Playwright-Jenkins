import test, { expect } from "@playwright/test";
import { request } from "node:http";
import { apiRequest, defaultGetRequest } from "../helpers/apiUtils";

test.use({
    baseURL: "https://reqres.in"
});

test("get users",
    async ({ request }) => {
        /*
    const response = await request.get("/api/users?page=2");
    expect(response.status()==200);
    const body  = await response.json();
    const entryPerPage = body.per_page;
    expect(body.data[0].id).toBe(7);
    const dataSize = body.data.length;
    expect(entryPerPage).toBe(dataSize);
    */
   console.log(await (await defaultGetRequest(request,'/api/users?page=2')).respone.json());

});

test.skip("Create User Post API", async ({request})=>{
    const obj = {
        headers: {
            "Content-Type": "application/json"
        },
        body : {
            name:"morpheus",
            job:"leader"
        }
    }

    const res = await apiRequest(request,'post','/api/users',obj);
    expect([200, 201]).toContain(res.respone.status());
    const body = await res.respone.json()
    expect(typeof parseInt(body.id)).toBe("number")

})