import express, {Application, Request, Response} from 'express';
import {LanguageInterface, UserInterface, WordInterface, WordInterfaceDb} from "../../src/models/ModelInterface";
import Utils from "./helpers/Utils";
import FaunaDbHelper, {DB_COLLECTION, DB_INDEX} from "./helpers/FaunaDbHelper";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const PORT = process.env.PORT

const app:Application = express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

const fauna = new FaunaDbHelper()

function prepareResponse(data:never,response:Response,error =  false,status =200,request?:Request):void{
    const responseData = {
        error:error,
        data:data,
    }
     response
        .contentType("text/json")
        .send(responseData);

    return
}

app.post("/register/language",async(request:Request,response:Response)=>{
    try {
        const lang: LanguageInterface = request.body as LanguageInterface;

        if (!(lang.title && lang.english_title && lang.country)) {
            prepareResponse("Missing Info" as never, response, true)
            return
        }
        lang.id = Utils.generateUId()
        lang.title = lang.title.toLowerCase()
        lang.english_title = lang.english_title.toLowerCase()


          fauna.Create<LanguageInterface>(DB_COLLECTION.LANGUAGE, lang, lang.id)
            .then(() => {
                prepareResponse(lang as never,response)
                return
            })

    } catch (e) {
         console.log("Error\n",e);
        prepareResponse("Something went wrong " as never,response,true)
        return
    }

})

app.post("/search/language",async(request:Request,response:Response)=>{
    try {
        const key = request.body.key;
       const data =  await fauna.GetBy<LanguageInterface>(DB_INDEX.LANGUAGE_BY_TITLE,key);
        prepareResponse(data as never,response)
    }catch(e){
        prepareResponse(`${e}` as never,response,true)
        return
    }
})

app.get("/register/word",async(request:Request,response:Response)=>{
    try {
        const newWord: WordInterfaceDb = request.body as WordInterfaceDb;

        if (!(newWord.english && newWord.language && newWord.word && newWord.level)) {
            prepareResponse("Missing Info" as never, response, true)
            return
        }
        newWord.id = Utils.generateUId()
        fauna.Create<WordInterfaceDb>(DB_COLLECTION.LANGUAGE, newWord, newWord.id).then(() => {
            prepareResponse(newWord as never,response)
            return
        })
    }catch(e){
         console.log(e);
    }
})

app.get("/register/user",async(request:Request,response:Response)=>{
    try {
        const user: UserInterface = request.body as UserInterface;

        if (!(user.email && user.name && user.main_lg && user.age)) {
            prepareResponse("Missing Info" as never, response, true)
            return
        }
        user.id = Utils.generateUId()
        fauna.Create<UserInterface>(DB_COLLECTION.LANGUAGE, user, user.id).then(() => {
            prepareResponse(user as never,response)
            return
        })
    }catch(e){
        console.log(e);
    }
})

app.get("/get/words/:level",async(request:Request,response:Response)=>{
    // const data = fauna.GetBy()
})



app.post("/",(request: Request, response: Response)=>{
    response
        .type("text/plain")
        .send("Hi")
});
app.get("/",(request: Request, response: Response)=>{
    response
        .type("text/plain")
        .send("Hi")
});

app.listen(PORT,()=> console.log(`API http://localhost:${PORT}`))
