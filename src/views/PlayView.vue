<template>
  <div class="pa-5 animated"   >
    <LinearLayout rounded-corners="8" style="border: 1px solid black"  class="mb-5 px-10 stats-card pa-2  justify-sm-space-between align-center" horizontal-orientation space-between>
      <div  v-for="(info, index) in userStats" :key="`stats_info${index}`">
        <TextView :text="info.field" caps  size="12" :color="colors.primaryText"/>
        <TextView :text="info.value" bold size="20" :color="colors.primaryText" />
      </div>
    </LinearLayout>
    <div  v-if="selectedWord">
      <LinearLayout ref="cardInfo" :background-tint="themes[selectedTheme].card" rounded-corners="20" pa="8"
                    :class="{'slide-right':slide}"
                    style="min-height:200px" :style="modifier.shadow(0,0,30,'#0000',HexAA.P0)">
        <LinearLayout horizontal-orientation>
          <TextView text="What's the meaning?" transform="capitalize" size="12" :color="`#000000${HexAA.P50}`"/>
          <v-spacer/>
          <TextView text="Deutsch" transform="capitalize" size="12" :color="`#000000${HexAA.P50}`"/>
        </LinearLayout>
        <TextView :text="selectedWord.word" bold size="30" class="my-3 text-wrap " style="  overflow: auto;"/>
        <TextView :text="selectedWord.definition || selectedWord.english" size="12" line-spacing="2"
                  :class="{'hidden-tip':!showTip}"/>
        <LinearLayout horizontal-orientation class="justify-end mt-4">
          <v-btn fab :color="themes[selectedTheme].accent" depressed small @click="viewTip()">
            <box-icon type="regular" name="message-square-error" color="black"/>
          </v-btn>
        </LinearLayout>
      </LinearLayout>
      <div class="mt-15">
        <LinearLayout horizontal-orientation class="align-center">
          <TextView text="Your Answer" bold :color="colors.primaryText" class="ml-2 my-2 mb-2" size="20"/>
          <box-icon type="regular" name="message-square-edit" class="mx-3" :color="colors.primaryText"/>
        </LinearLayout>
        <v-text-field mt-6 outlined style="border-radius: 15px"
                      :dark="isDark"
                      x-large
                      v-model="inputValue"
                      :rules="rule"
                      :color="colors.primaryText"
                      autocomplete="off"

        />
        <vs-alert relief  color="danger" v-if="showAlert">
          <div >
            Not right :((
          </div>
        </vs-alert>
      </div>
      <v-flex style="bottom:0;left:0; position: fixed; width: 100%;">
        <v-btn min-height="60" :color="themes[selectedTheme].accent" :disabled="showAlert" block depressed x-large style="border-radius: 15px 15px 0 0" class="mr-5"
               @click="restartAnimation()">
          <TextView text="Next" caps bold color="black"/>
        </v-btn>
      </v-flex>
    </div>
    <div v-else>
      <TextView text="Your Vocab is empty" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Component from "vue-class-component";
import TextView from "@/utils/UI/TextView/TextView.vue";
import Constants from '@/values/Constants';
import {ColorType,HexAA} from "@/values/Colors";
import {LanguageType} from "@/values/Strings";
import LinearLayout from "@/utils/UI/LinearLayout/LinearLayout.vue";
import Modifier from "@/values/Modifier";
import Utils from "@/utils/Utils";
import {LanguageList, UserStats, WordInterface} from "@/models/ModelInterface";
import APIPoint from "@/api/APIPoint";
import {appRouter} from "@/router";



@Component({
  components: {LinearLayout, TextView}
})
export default class PlayView extends Vue {
  //VARIABLES DECLARATION HERE
  public modifier = Modifier
  public HexAA = HexAA
  public themes = this.colors.playViewThemes as Array<{card:string,accent:string}>
  public selectedTheme:number = 5
  public slide = false
  public showTip = false
  public selectedWord:WordInterface =  {
    word : "No Word",
    english : "Add Word to Play",
    language:LanguageList.DEUTSCH,
    id:"0",
    level:"1",
    definition:"Add Word To Play"
  }
  public inputValue:string = ""
  public rule = []
  public showAlert:boolean = false

  public statsInfo = [
    {field:"attempts",icon:"",value:0},
    {field:"Wrong",icon:"",value:0},
    {field:"Right",icon:"",value:0},
  ]
  
  
  
  /**
   COMPUTED PROPERTIES HERE (getter and Setters)
   **/

  get colors():ColorType {
    return this.$store.getters.colors;
  }

  get strings():LanguageType {
    return this.$store.getters.strings;
  }
  get isDark():boolean {
    return this.$store.getters.isDark;
  }
  
  get wordList():Array<WordInterface>{
    return (this.$store.getters.wordList as Array<WordInterface>)
  }

  get userStats ():[ Record<any, any>]{
    return  this.$store.getters.userStats

  }

  checkResponse ():boolean{
    if(this.selectedWord.word === "No Word"){
      return false
    }
    // console.log(`Input ${this.inputValue}, English ${this.selectedWord.english} Deutsch ${this.selectedWord.word}`);
      const word  = this.selectedWord.english.trim().toLocaleLowerCase()
    return word.includes(this.inputValue.trim().toLocaleLowerCase());
  }

  viewTip():void {
    this.showTip = !this.showTip
    setTimeout(() =>{
      this.showTip = false
    },5000)
  }
  selectWord():void{
    this.inputValue = ""
    const selectedIndex = Utils.getRandomInt(this.wordList.length)
    this.selectedWord = this.wordList[selectedIndex]
  }
  setAlert():void{
    this.showAlert = true
    setTimeout(() => this.showAlert = false,2000)
  }
  restartAnimation():void{

    if(!this.checkResponse()) {
      this.updatePoint(true)
      this.setAlert()
      return
    }

    this.updatePoint(false)
    if(this.wordList.length  === 0)
      return

    this.selectedTheme = Utils.getRandomInt(this.themes.length)
    // this.wo
     this.slide = true
      setTimeout(()=>{
       this.slide = false
        this.selectWord()
      },300)

  }
  updatePoint(wrong:boolean):void{
    this.$store.dispatch("updateUserStats",wrong)


  }
  async getWordsFromServer(): Promise<void> {
        if(this.wordList.length < 1) {
          const API = new APIPoint()
         let data =  await  API.load<WordInterface>();
         if(data['error']){
           return
         }
        
          this.$store.dispatch("updateWordList",data).then(()=>{
            console.log(this.wordList)
            this.selectWord()
          })
        }else {
          this.selectWord()
        }
  }
  /**
   Life-Hook
   **/
  mounted():void {
    this.getWordsFromServer()
    // this.restartAnimation()
  }

  /** Methods & watchers
   //@Watch('trigger')
   //onPropertyChanged(flag:boolean,oldFlag:boolean){}
   */


}
</script>

<style scoped lang="scss">

.stats-card{
    box-shadow: 5px 5px 0  black;
}

  .animated{

    .slide-right {
      -webkit-animation: hidden-tip 0.15s ease-in-out;
      animation: hidden-tip 0.15s ease-in-out;
    }
    .cardInfo{
      transition: all 0.12s ease-in-out;
    }
    .hidden-tip{
      overflow: hidden;
      //transform: translateX(-100px);
      height: 0!important;
    }

  }

  @keyframes hidden-tip {
    0% {
      -webkit-transform: translateX(0px);
      transform: translateX(0px);
    }
    100% {
      -webkit-transform: translateX(100%);
      transform: translateX(100%);
    }
  }

  /* ----------------------------------------------
 * Generated by Animista on 2021-3-30 5:26:8
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

  /**
   * ----------------------------------------
   * animation slide-right
   * ----------------------------------------
   */
  @-webkit-keyframes slide-right {
    0% {
      -webkit-transform: translateX(-200px);
      transform: translateX(-200px);
    }
    100% {
      -webkit-transform: translateX(0px);
      transform: translateX(0px);
    }
  }
  @keyframes slide-right {
    0% {
      -webkit-transform: translateX(100px);
      transform: translateX(100px);
    }
    100% {
      -webkit-transform: translateX(0px);
      transform: translateX(0px);
    }
  }

  /* ----------------------------------------------
 * Generated by Animista on 2021-3-30 5:59:40
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

  /**
   * ----------------------------------------
   * animation scale-up-hor-center
   * ----------------------------------------
   */
  @-webkit-keyframes scale-up-hor-center {
    0% {
      -webkit-transform: scaleX(0.4);
      transform: scaleX(0.4);
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
    }
  }
  @keyframes scale-up-hor-center {
    0% {
      -webkit-transform: scaleX(0.4);
      transform: scaleX(0.4);
    }
    100% {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
    }
  }



</style>