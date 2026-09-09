import test, { expect } from "@playwright/test";
import { createUser, requestModel } from "../models/userDetails";
import { faker } from "@faker-js/faker";
import { apiRequest, defaultGetRequest } from "../helpers/apiUtils";
import chalk from "chalk";

var firstUserID: number;
var firstEmail: String;
var createdUserID: number;

const createuser: createUser = {
    name: faker.person.firstName(),
    email: faker.person.lastName()+"@exam.com",
    gender: faker.person.sex(),
    status: "active",
};
const AuthHeader = {
    Authorization:
        "Bearer d09bf8db622c67242ec9c98652e59056e44f23c0adfcd57b02d75abf348431cf",
};
test.describe.configure({ mode: "serial" });

test.use({
    baseURL: "https://gorest.co.in",
});

test.beforeEach("Open start URL", () => {
    console.log(chalk.bold.underlineGreen(
        "\n*************************",
        test.info().title,
        "********************************\n",
    ))
});

test.afterEach("Open start URL", () => {
    console.log(chalk.bold.underlineGreen(
        "\n*********************************************************\n",
    ))
});


test("validate and get all users list", async ({ request }) => {
    const response = await request.get("/public/v2/users");
    firstUserID = (await response.json())[0].id;
    firstEmail = (await response.json())[0].email;
    expect(response.status()).toBe(200);
    expect(firstUserID).not.toBe(0);
    expect((await response.json()).length).toBe(10);
    console.log("TEST END");

});


test(`get user by id `, async ({ request }) => {
    /* Add more description to Test as if we put in test Desription we
        // get intial value as all test are evaluated at the same time.
        */
    test.info().annotations.push({
        type: "userId",
        description: String(firstUserID),
    });

    // Skip in case of this value is not set
    test.skip(
        firstUserID == undefined,
        "test is skip as UserId not unable to set",
    );
    const responseWithTime = await defaultGetRequest(
        request,
        `/public/v2/users/${firstUserID}`,
    );
    expect([200, 201]).toContain(responseWithTime.respone.status());
    expect(responseWithTime.responseTime).toBeLessThan(2000);
});

test("create new user", async ({ request }) => {
    const Obj = {
        headers: AuthHeader,
        body: createuser,
    };

    const responseWithTime = await apiRequest(
        request,
        "post",
        "/public/v2/users",
        Obj,
    );
    console.log(await responseWithTime.respone.json());
    createdUserID = (await responseWithTime.respone.json()).id;
});


test("Update user details that we pushed", async ({ request }) => {
    const fullName = faker.person.fullName();

    await defaultGetRequest(request, `/public/v2/users/${firstUserID}`);

    const obj: requestModel = {
        headers: AuthHeader,
        body: {
            name: fullName,
            status: "inactive",
        },
    };

    //Dectruct the object to only return headers
    const { body, ...onlyHeader } = obj;

    console.log(
        "++++++++++++++++++++++Update upser DATA +++++++++++++++++++++++",
    );

    const responseWithTime = await apiRequest(
        request,
        "put",
        `/public/v2/users/${firstUserID}`,
        obj,
    );
    expect([200, 201]).toContain(responseWithTime.respone.status());

    // Wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const oo = {
        headers: AuthHeader,
    };

    //validate now
    const resp = await apiRequest(
        request,
        "get",
        `/public/v2/users/${firstUserID}`,
        onlyHeader,
    );
    expect((await resp.respone.json()).name).toBe(fullName);
});

test("Negative Test - create user with same email", async ({ request }) => {
    const copied = {...createuser};
    copied.email = firstEmail;
    const Obj = {
        headers: AuthHeader,
        body: copied,
    };
    const responseWithTime = await apiRequest(
        request,
        "post",
        "/public/v2/users",
        Obj,
    );
    expect(responseWithTime.respone.status()).toBe(422);
    expect((await responseWithTime.respone.json())[0].field).toBe("email");
    expect((await responseWithTime.respone.json())[0].message).toBe(
        "has already been taken",
    );
});

test("Delete user by ID", async ({request})=>{

    const Obj = {
        headers: AuthHeader,
        body: {...createuser, "id": createdUserID},
    };
    const responseWithTime = await apiRequest(
        request,
        "delete",
        `/public/v2/users/${createdUserID}`,
        Obj,
    );

    expect(responseWithTime.respone.status()).toBe(204);
    const newResponse = await apiRequest(request,'get',`/public/v2/users/${createdUserID}`,{headers: AuthHeader});
    expect((await newResponse.respone.json()).message).toBe("Resource not found")

})