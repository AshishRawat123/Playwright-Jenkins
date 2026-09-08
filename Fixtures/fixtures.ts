import {test as base, APIRequestContext} from "@playwright/test";
import {LoginPage} from '../pages/LoginPage'
import {MyInfoPage} from '../pages/MyInfoPage'

// return page objects as dependency injection

type fixtureObj = {
    loginPage : LoginPage,
    myInfopage : MyInfoPage,
    api : APIRequestContext

}

export const test = base.extend<fixtureObj>({

        loginPage : async ({page}, use)=> {
            await use(new LoginPage(page));
        },

        myInfopage: async ({page}, use)=>{
            await use(new MyInfoPage(page));
        }

    })