import express, {Application, Request, Response} from 'express';
import {LanguageInterface, UserInterface, WordInterface, WordInterfaceDb} from "../../src/models/ModelInterface";
import Utils from "./helpers/Utils";
import FaunaDbHelper, {DB_COLLECTION, DB_INDEX} from "./helpers/FaunaDbHelper";
import Speech from "./helpers/Speech";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

const CORS = {
    origin: ["http://localhost:8080"],
    optionsSuccessStatus: 200 // For legacy browser support
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
const allowedOrigins = ['http://localhost:8080', 'http://localhost:8020', 'http://127.0.0.1:9000', 'http://localhost:9000'];


const PORT = process.env.PORT

const app:Application = express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
// app.use(express.)

const fauna = new FaunaDbHelper()


function checkOrigin(response:Response,request:Request){


}
function prepareResponse<T>(data:never | T,response:Response,error =  false,status =200,request?:Request):void{
    const responseData = {
        error:error,
        data:data,
    }
     response
        .contentType("text/json")
        .send(responseData);

    return
}

app.post("/speech" ,async(request:Request,response:Response)=>{
    await Speech.quickStart()
    prepareResponse("done" as never,response)
})

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


         const requestFB = await fauna.Create<LanguageInterface>(DB_COLLECTION.LANGUAGE, lang, lang.id)
            if(requestFB.error){
                prepareResponse(requestFB.data ,response)
            }else{
                prepareResponse(lang as never,response)

            }
        return
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

app.post("/register/word",async(request:Request,response:Response)=>{


    try {
        response.header("Access-Control-Allow-Origin", "*");
        response.header('Access-Control-Allow-Methods', 'DELETE, PUT,POST');
        response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        const newWord: WordInterfaceDb = request.body as WordInterfaceDb;

        if (!(newWord.english && newWord.language && newWord.word && newWord.level)) {
            prepareResponse("Something Missing" , response, true)
            return
        }
        newWord.id = Utils.generateUId()
        const requestFauna  = await fauna.Create<WordInterfaceDb>(DB_COLLECTION.word, newWord, newWord.id)
        if(requestFauna.error)
            prepareResponse(requestFauna.data as never,response)
        else
            prepareResponse(newWord as never,response)

        return

    }catch(e){
         console.log(e);
        prepareResponse(e as never, response, true)
        return
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
        const requestFauna =  await fauna.Create<UserInterface>(DB_COLLECTION.LANGUAGE, user, user.id)
        if(requestFauna.error)
            prepareResponse(requestFauna.data ,response)
        else
            prepareResponse(user ,response)

        return
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
        .send("Hi Post")
});
app.get("/",(request: Request, response: Response)=>{
    response.header("Access-Control-Allow-Origin", ["http://localhost:8080"]);
    response.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response
        .type("text/plain")
        .send("Hi Get")
});

app.all('*', function(request, response, next) {
    const origin = request.headers.origin as string;
    if (allowedOrigins.includes(origin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    }
    response.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.listen(PORT,()=> console.log(`API http://localhost:${PORT}`))
