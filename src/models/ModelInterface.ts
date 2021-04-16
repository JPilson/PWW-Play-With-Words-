/**
 *ModelInterface
 * Created by mac on 30/03/21
 * JPilson Sumbo
 */

export interface WordInterface extends WordInterfaceDb{
    pt?:string;
    attempts?:number;
    right?:number;

}

export enum LanguageList{
    DEUTSCH = "deutsch",
    ENGLISH = "english",
    PORTUGUES = "portugues"

}

export interface WordInterfaceDb {
    id:string;
    level:string;
    word:string;
    english:string;
    definition:string;
    language:string;
}

export interface UserInterface {
    id:string;
    name:string;
    email:string;
    main_lg:string;
    age:number;

}

export interface LanguageInterface {
    id:string;
    title:string ;
    english_title:string;
    country:string;



}