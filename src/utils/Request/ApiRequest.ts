/**
 *ApiRequest
 * Created by mac on 17/04/21
 * criator.pulsomusicas.com
 */
import axios,{AxiosRequestConfig} from "axios";

const BASEURL = "http://localhost:5001/"
export interface ResponseInterface<T> {
    length: number;
    data:T;
    error?: boolean;
    message?: [];
}
export interface HeaderInterface {
    "content-type"?:string;
    Authorization?:string;
}
export default class ApiRequest {


    public static REGISTER_WORD = `${BASEURL}register/word`
    public static BASE_URL =BASEURL

    /**
     *
     * @param url
     * @param query
     * @param config
     * @param mix
     * @returns {<{error:boolean,message:string,data:[]}}
     */
    public userRequest<T>(url: string, query:FormData | Record<string,string> , config?:AxiosRequestConfig, mix?: string): Promise<string> | undefined | ResponseInterface<T> {
        try {
            return config ? this.request("get",url, query, mix ?? "", config) : this.request("get",url, query, mix ?? "") as unknown as ResponseInterface<T>;
        } catch (e) {
            console.log(e);
            return {
                data: [],
                length: 0,
                error: true,
                message: [e]
            } as unknown as ResponseInterface<T>
        }
    }
    async fetchBlob(url:string,query:FormData,):Promise<Blob|undefined>{
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + "");
        const requestOptions:RequestInit = {
            method: 'POST',
            headers:myHeaders,
            redirect: 'follow',
            body: query,

        };

        return fetch(url, requestOptions)
            .then(response => response.blob())
            .then(result => {
                return result;

            })
            .catch(error => {
                    throw new Error(error);
                }
            );
    }

    /**
     *
     * @param Method
     * @param url
     * @param body
     * @param token
     * @param config
     */
    public request<T>(Method:"get"|"post" = "post" ,url: string, body?: FormData | T, token: string = "none" , config: AxiosRequestConfig ={
        headers:{"content-type":"application/json; charset=UTF-8"} as HeaderInterface
    }): Promise<any> | undefined {
        if (body === null)
            body = new FormData();

        if(!config.headers.Authorization) {
            config.headers.Authorization =  `Bearer ${token?.trim()}`;
        }
        if(Method === "post")
            return axios.post(url, body, config).then((data:any) => {
                //TODO: id request has 401 and status is unauthorized log out user if its logged

                return data.data;
            }).catch((error:any) => {
                throw new Error(error);
            })

        if(Method === "get")
            return axios.get(url).then((data:any) => {
                //TODO: id request has 401 and status is unauthorized log out user if its logged

                return data.data;
            }).catch((error:any) => {
                throw new Error(error);
            })

    }
}