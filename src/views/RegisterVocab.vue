<template>
  <div class="pa-5"  >
    <v-flex style="min-height: 100%">
      <div class="my-5">
        <TextView text="New Word!" bold size="30" :color="colors.primaryText"/>
        <TextView text="Expand your vocabulary" size="12" :color="colors.primaryText"/>
      </div>
      <v-form class="mt-5" style="padding-bottom: 150px">
        <v-flex v-for="(field,index) in inputFields" :key="`field${index}`">
          <TextView :text="field.name" :color="field.color" bold class="ml-2 my-2"/>
          <div v-if="field.textarea">
            <v-textarea :placeholder="field.placeholder" v-model="field.value" outlined style="border-radius: 15px"  :dark="isDark"
                        :color="field.color"/>
          </div>
          <div v-else>
            <v-text-field :placeholder="field.placeholder" v-model="field.value" outlined style="border-radius: 15px"
                          :dark="isDark"
                          :color="field.color"/>
          </div>

        </v-flex>
      </v-form>
    </v-flex>
    <LinearLayout  style="position: fixed; bottom:0;left:0;  width:100%" class="mb-5  " :background-tint="colors.background"  >
      <LinearLayout horizontal-orientation >
        <v-btn  fab :color="colors.card" class="ml-5" @click="GoBAck()">
          <box-icon type="regular" name="chevron-left" :color="colors.primaryText" />
        </v-btn>
        <v-spacer/>
        <v-btn :color="colors.confirm"  depressed x-large style="border-radius: 15px" class="mr-5" @click="GoBAck()">
          <TextView text="save" caps bold color="black"/>
        </v-btn>


      </LinearLayout>
    </LinearLayout>
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
import {appRouter} from "@/router";



@Component({
  components: {LinearLayout, TextView}
})
export default class RegisterVocab extends Vue {
  //VARIABLES DECLARATION HERE
  public modifier = Modifier
  public HexAA = HexAA

 public inputFields = {
   word:{name:"Word",value:"",rule:"",placeholder:"Deutsch",textarea:false,color:"#b1e36a"},
   definition:{name:"Definition",value:"",rule:"",placeholder:"Definition or tip",textarea:true,color:this.colors.primaryText},
   english:{name:"English",value:"",rule:"",placeholder:"Deutsch",textarea:false,color:this.colors.primaryText},
   englishs:{name:"English",value:"",rule:"",placeholder:"Deutsch",textarea:false,color:this.colors.primaryText},
   englishss:{name:"English",value:"",rule:"",placeholder:"Deutsch",textarea:false,color:this.colors.primaryText},

 }
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

  GoBAck ():void{
    window.history.length > 1 ? this.$router.go(-1) : this.$router.push(appRouter.home);
  }
  /**
   Life-Hook
   **/
  mounted():void {


  }

  /** Methods & watchers
   //@Watch('trigger')
   //onPropertyChanged(flag:boolean,oldFlag:boolean){}
   */


}
</script>

<style scoped>

</style>