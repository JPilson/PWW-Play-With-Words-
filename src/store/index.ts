import Vue from 'vue'
import Vuex from 'vuex'
import Colors, {AppTheme} from "@/values/Colors";
import Strings, {LanguageType} from "@/values/Strings";
import {UserInterface, UserStats, WordInterface} from "@/models/ModelInterface";
import DataBase, {TABLE_NAME} from "@/store/DataBase";

export enum DataInterfaceType {

}

export interface DataInterface<T>  {
  type: DataInterfaceType;
  data: T;
  isUpdateItemIndex?:number;

}
const theme:AppTheme = AppTheme.dark
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: theme,
    values:{
      colors:Colors[theme],
      strings:Strings.pt
    },
    wordList:[] as Array<WordInterface>,
    userStats:{
      id:"8359630141",
      stats: {
        attempts:0,
        right:0,
        wrong:0
      }
    } as UserStats,
    isSessionActive:false,
    userInfo : {} as UserInterface

  },
  mutations: {
    updateWordList(state,payload:Array<WordInterface>){
      state.wordList = payload
    },
    async updateUserStats(state, wrong: boolean) {
      if(wrong)
        state.userStats.stats.wrong++ // in case the user fails increment the number of wrong answers
      else
        state.userStats.stats.right++ // right answers

      state.userStats.stats.attempts++ // number of attempts

      await DataBase.insertInto<UserStats>(TABLE_NAME.USER_STATS, state.userStats)
    },
    updateSession(state,payload:boolean){
      console.log(`state is ${payload}`)
      state.isSessionActive  = payload
    }
  },
  actions: {
    updateWordList(context,payload){
      context.commit("updateWordList",payload)
    },
    updateUserStats(context,payload){
      context.commit("updateUserStats",payload)
    },
    updateSession(context,payload) {
      context.commit("updateUserStats",payload)
    }
  },
  modules: {
  },
  getters: {
    colors(state){
      return state.values.colors;
    },
    strings(state):LanguageType{
      return state.values.strings as LanguageType;
    },
    isDark(state):boolean {

      return state.theme == AppTheme.dark
    },
    wordList(state):Array<WordInterface>{
      return state.wordList
    },
    userStats(state):Array<{ field: string; value: number }>{

        const data:UserStats =  state.userStats
      return   [
          {field:"Attempts",value:data.stats.attempts??0},
          {field:"Wrong",value:data.stats.wrong??0},
          {field:"Right",value:data.stats.right??0}
      ]
    },
    isSessionActive(state):boolean {
      return  state.isSessionActive
    }


  }
})
