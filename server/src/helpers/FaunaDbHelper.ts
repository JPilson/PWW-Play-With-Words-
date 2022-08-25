import * as Faunadb from "faunaDb"
import {errors} from "faunaDb";
import BadRequest = errors.BadRequest;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export enum DB_INDEX {
    USER_BY_UID = "user_by_uid",
    LANGUAGE_BY_TITLE = "language_by_title",
}

export enum DB_COLLECTION {
    USERS = "users",
    LANGUAGE = "language",
    word = "words"
}

export default class FaunaDbHelper {

    private client!: Faunadb.Client
    private FQL = Faunadb.query

    connect():Faunadb.Client{
        return new Faunadb.Client({secret:process.env.FAUNA_SECRET!});
    }

    async Create<T>(Collection:DB_COLLECTION, data:T,ref:string,client?:Faunadb.Client):Promise<{error:boolean;data:any}>{
        try {
            client = client ?? this.connect();
            const FQL  =  this.FQL
            const request =  await client.query(
                FQL.Create(FQL.Ref(FQL.Collection(Collection), ref), {
                    data: data
                })
            )
            return {
                error:false,
                data:request
            }
        }catch (err){
            return {
                error:true,
                data:err.description
            }

        }
    }
    Update<T>(Collection:DB_COLLECTION,ref:string,newData:T,client?:Faunadb.Client):Promise<Faunadb.Expr>{
        try {
            client = client ?? this.connect()
            const FQL = this.FQL
            return client.query(FQL.Update(FQL.Ref(FQL.Collection(Collection),ref),{data:newData}));

        }catch(err){

            throw Error(err)
        }
    }
    async GetBy<T>(QueryIndex:DB_INDEX,key:string | number | boolean,client?:Faunadb.Client):Promise<[T]>{
        try {
            client = client ?? this.connect();
            const FQL  =  this.FQL
            return await client.query(
                FQL.Select("data",FQL.Get(FQL.Match(FQL.Index(QueryIndex), key)))
            );
        }catch (err){
             console.log(err);
            throw Error(err)
        }
    }
    async Get<T>(collection:DB_COLLECTION){
        const client = this.connect();
        const FQL  =  this.FQL
        const data = await client.query(FQL.Get(collection));
    }


}