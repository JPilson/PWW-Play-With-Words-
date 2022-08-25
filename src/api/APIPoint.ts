
// eslint-disable-next-line @typescript-eslint/no-var-requires
import {UserInterface} from "@/models/ModelInterface";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios').default;
const END_POINT = process.env.VUE_APP_SERVER_ENDPOINT



export default  class APIPoint {
    constructor() {
    }

    async load<T>():Promise<any | Array<T>>{
        const request =  await this.request<T>(`${END_POINT}get/words/1`)
        if(request.error){
            return request
        }
        return  ((request['data'] as any)['data']) as Array<T>

    }
    async registerUser (userInfo:UserInterface): Promise<UserInterface> {
            const result =   await  this.request<UserInterface>(END_POINT+'register/user', userInfo as unknown as URLSearchParams);
                return result as unknown as UserInterface
    }
    async request<T>(url:string,body?:URLSearchParams):Promise<{ data?: Array<T>; error: boolean,message?:string }>{
        try {
            const config = {
                method: 'POST',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: body,
                url,
            };
            const result = await axios(config)
            if(result.error){
                return result
            }
            const dataResult = result.data
            return {
                error:false,
                data:dataResult["data"]
            }

        } catch (e) {
            return {
                error:true,
                message:e
            }
        }
    }
}