import * as Faunadb from "faunaDb"
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

export enum DB_INDEX {
    USER_BY_UID = "user_by_uid",
}

export enum DB_COLLECTION {
    USERS = "Users",
}

export default class FaunaDbHelper {

    private client!: Faunadb.Client
    private FQL = Faunadb.query

    connect():Faunadb.Client{
        return new Faunadb.Client({secret:process.env.FAUNA_SECRET!});
    }

    async Create<T>(Collection:string, data:T,ref:string,client?:Faunadb.Client):Promise<Faunadb.Expr>{
        try {
            client = client ?? this.connect();
            const FQL  =  this.FQL
            return await client.query(
                FQL.Create(FQL.Ref(FQL.Collection(Collection), ref), {
                    data: data
                })
            )
        }catch (err){
            throw Error(err);
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
    async GetBy<T>(QueryIndex:string,key:string | number | boolean,client?:Faunadb.Client):Promise<[T]>{
        try {
            client = client ?? this.connect();
            const FQL  =  this.FQL
            return await client.query(FQL.Get(FQL.Match(FQL.Index(QueryIndex), key)));
        }catch (err){
            throw Error(err)
        }
    }


}