import Vue from 'vue'
import Vuex from 'vuex'
import Colors, {AppTheme} from "@/values/Colors";
import Strings, {LanguageType} from "@/values/Strings";

export enum DataInterfaceType {

}

export interface DataInterface<T>  {
  type: DataInterfaceType;
  data: T;
  isUpdateItemIndex?:number;

}
const theme:AppTheme = AppTheme.light
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    theme: AppTheme.light,
    values:{
      colors:Colors[theme],
      strings:Strings.pt
    },
  },
  mutations: {
  },
  actions: {
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
    }
  }
})
