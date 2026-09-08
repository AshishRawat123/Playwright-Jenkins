import test, { expect } from "@playwright/test";
import { apiRequest } from "../helpers/apiUtils";

var token: string;
var bookingID: number;

test('validate create token API', async ({request})=>{

    const Obj = {
      body: {
        username: "admin",
        password: "password123",
      },
    };
    const resposeWithTime = await apiRequest(request,'post', ' https://restful-booker.herokuapp.com/auth',Obj);
    token = (await resposeWithTime.respone.json()).token;
    console.log("token  ",token);

});

test('create booking api',async ({request})=>{
    const  obj = {
        body : {
    "firstname" : "Jame",
    "lastname" : "Brow",
    "totalprice" : 194,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfahhh"
}
    }

    const responseWithTime = await apiRequest(request,'post',`https://restful-booker.herokuapp.com/booking`,obj);
    bookingID = (await responseWithTime.respone.json()).bookingid;
})

test.fail('update booking as token not working',async ({request})=>{

    const obj = {
        header: {
            "Accept": "application/json",
            "Cookie": `token=${token}`  // token should be passed so it can work but not working
        },
        body: {
            "firstname" : "Jamees",
            "lastname" : "Brownieee"
        } 
    }

    console.log('token : ',token);
    const responseWithTime = await apiRequest(request,'patch',`https://restful-booker.herokuapp.com/booking/${bookingID}`,obj);
    expect([201,200]).toContain(responseWithTime.respone.status());


})