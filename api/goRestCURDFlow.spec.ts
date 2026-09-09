import test, { expect } from "@playwright/test";
import { createUser, requestModel } from "../models/userDetails";
import { faker } from "@faker-js/faker";
import { apiRequest, defaultGetRequest } from "../helpers/apiUtils";

var firstUserID: number;
var firstEmail: String;
var createdUserID: number;

const createuser: createUser = {
    name: faker.person.firstName(),
    email: faker.person.lastName(),
    gender: faker.person.sex(),
    status: "active",
};
const AuthHeader = {
    Authorization:
        "Bearer 90f73022d42112f6392d8334f6c77a003131cf781899041688eff15ced9d8b5d",
};
test.describe.configure({ mode: "serial" });

test.use({
    baseURL: "https://gorest.co.in",
});

test.beforeEach("Open start URL", () => {
    console.log(
        "\n*************************",
        test.info().title,
        "********************************\n",
    );
});

test("validate and get all users list", async ({ request }) => {
    const response = await request.get("/public/v2/users");
    firstUserID = (await response.json())[0].id;
    firstEmail = (await response.json())[0].email;
    expect(response.status()).toBe(200);
    expect(firstUserID).not.toBe(0);
    expect((await response.json()).length).toBe(10);
    console.log("TEST END");
    console.log("first User ID is   ", firstUserID);
    console.log("email of first : ", firstEmail);
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
        header: {
            Authorization:
                "Bearer 90f73022d42112f6392d8334f6c77a003131cf781899041688eff15ced9d8b5d",
        },
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
    createuser.email = firstEmail;
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
    expect(responseWithTime.respone.status()).toBe(422);
    expect((await responseWithTime.respone.json())[0].field).toBe("email");
    expect((await responseWithTime.respone.json())[0].message).toBe(
        "has already been taken",
    );
});
