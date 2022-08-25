<template>
  <div class="pa-5"  >
    <v-flex style="min-height: 100%">
      <div class="my-5">
        <TextView text="New Word!" bold size="30" :color="colors.primaryText"/>
        <TextView text="Expand your vocabulary" size="12" :color="colors.primaryText"/>
      </div>
      <v-form class="mt-5" ref="sub_form" style="padding-bottom: 150px">
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
        <input
            type="file"
            :ref="'fileInput'"
            style="display:none"

            @change="onFileSelected"
        />

        <v-btn :color="colors.confirm"  depressed x-large style="border-radius: 15px" class="mr-5" @click="GoBAck()">
          <TextView text="save" caps bold color="black"/>
        </v-btn>


      </LinearLayout>
    </LinearLayout>
    <div class="centered-item" >
      <vs-dialog  v-model="selectionDialog" :loading="isRegistering" overflow-hidden prevent-close blur scroll>
        <template #header>
          <div>
            <TextView text="New Word!" bold size="30" :color="colors.primaryText"/>
            <TextView text="Expand your vocabulary" size="12" :color="colors.primaryText"/>
            <LinearLayout horizontal-orientation  v-if="visibleView === 2">
              <vs-button
                  color="success"
                  @click="saveWords(false)">
                Use File
              </vs-button>
              <vs-button
                  transparent
                  @click="saveWords(true)">
                Save Words
              </vs-button>
            </LinearLayout>
          </div>
        </template>
        <v-stepper class="elevation-0" :value="visibleView" :style="`-webkit-box-shadow: none; box-shadow: none;`">

          <v-stepper-items elevation-0>

            <v-stepper-content step="1" style="padding: 0!important;margin: 0!important">
              <LinearLayout @onClick="fileSelection" class="centered-item " pa="5" :background-tint="`#d6ffbc`" radius-bottom-left="10" radius-bottom-right="2" radius-top-left="15" radius-top-right="2"    >
                <box-icon type="regular" name="file"   color="black"  />
                <TextView :text="`Register Words from XL file`" bold />
              </LinearLayout>
              <LinearLayout class="centered-item my-2 " pa="5" :background-tint="`#bcf5ff`" radius-bottom-left="10" radius-bottom-right="2" radius-top-left="15" radius-top-right="2"   >
                <box-icon type="regular" name="message-alt-edit"   color="black"  />
                <TextView :text="`Register Manually`" bold />
              </LinearLayout>
            </v-stepper-content>

            <v-stepper-content step="2" style="padding: 0!important;margin: 0!important">
              <LinearLayout @onClick="fileSelection" class="centered-item my-2 "  v-for="(word,index) in words" :key = "`w_i${index}`" pa="5" :background-tint="`#d6ffbc`" rounded-corners="15"    >
                <TextView :text="word.word" bold />
                <TextView :text="word.english"  />
                <TextView :text="word.definition"  />
              </LinearLayout>
            </v-stepper-content>
            <v-stepper-content step="3" style="padding: 0!important;margin: 0!important">
              <LinearLayout @onClick="fileSelection"  class="centered-item my-2 " pa="5" :background-tint="`#d6ffbc`" radius-bottom-left="10" radius-bottom-right="2" radius-top-left="15" radius-top-right="2"    >
                <TextView text="Use File Data" />
              </LinearLayout>
              <LinearLayout @onClick="fileSelection" class="centered-item my-2 " pa="5" :background-tint="`#d6ffbc`" radius-bottom-left="10" radius-bottom-right="2" radius-top-left="15" radius-top-right="2"    >
                <TextView text="Use Online Data" />
              </LinearLayout>

            </v-stepper-content>
          </v-stepper-items>

        </v-stepper>

      </vs-dialog>
    </div>


  </div>
</template>

<script lang="ts">
import Vue from "vue"
import Component from "vue-class-component";
import TextView from "@/utils/UI/TextView/TextView.vue";
import {ColorType, HexAA} from "@/values/Colors";
import {LanguageType} from "@/values/Strings";
import LinearLayout from "@/utils/UI/LinearLayout/LinearLayout.vue";
import Modifier from "@/values/Modifier";
import {appRouter} from "@/router";
// import readXlsxFile from 'readXlsxFile'
import * as XLSX from 'xlsx';
import {LanguageList, WordInterface} from "@/models/ModelInterface";
import ApiRequest, {ResponseInterface} from "@/utils/Request/ApiRequest";

enum fieldType {
  word,
  definition,
  english,
  optional
}

interface inputField {
  name: string;
  value: never ;
  rule: never ;
  placeholder: string;
  textarea: boolean;
  color: string;
  type: fieldType ;
}

interface FileStructure {
  fieldName: string;
  description:string;
  optional:boolean
}

@Component({
  components: {LinearLayout, TextView}
})
export default class RegisterVocab extends Vue {
  //VARIABLES DECLARATION HERE
  public visibleView = 1
  public selectionDialog = false
  public isRegistering = false
  public modifier = Modifier
  public HexAA = HexAA
  public fileStructure:Record<string,FileStructure> = {
    word:{fieldName:"deutsch",description:"Deutsch Word",optional:false},
    translation:{fieldName:"Vokabeln",description:"English Translation Field",optional:false},
    tip:{fieldName:"definition",description:"Tip of the Word or Definition",optional:true}
  }

  // public words:Collections.Set<WordInterface> = new Collections.Set();
  public words : Array<WordInterface> = []
 public inputFields = {
   word:{name:"Word",value:"",rule:[],placeholder:"Deutsch",textarea:false,color:"#b1e36a",type:fieldType.word},
   definition:{name:"Definition",value:"",rule:"",placeholder:"Definition or tip",textarea:true,color:this.colors.primaryText,type:fieldType.definition},
   english:{name:"English",value:"",rule:"",placeholder:"Deutsch",textarea:false,color:this.colors.primaryText,type:fieldType.english},
   portugues:{name:"Portugues(Optional)",value:"",rule:"",placeholder:"Deutsch",textarea:false,color:this.colors.primaryText,type:fieldType.optional},

 }

 public files:Array<File> = []
  public sheets:Array<any> = []
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
  registerWord():void{

    // const reader: FileReader = new FileReader();
    // reader.readAsBinaryString(target.files[0]);
    // Object.entries(this.inputFields).forEach((element:inputField) => {
    //     if()
    // })
  }
   fileSelection():void{
     (this.$refs.fileInput as Vue & { click: () => void }).click()
  }
  async saveWords(saveOnline:boolean = false): Promise<void>{
    let words:Array<WordInterface> ;
    try {
      if(saveOnline){
         words = []
        this.isRegistering = true
        for (const element of this.words) {
          const query = new FormData();
          query.append("english", element.english)
          const response = await new ApiRequest().request("post", ApiRequest.REGISTER_WORD, element) as ResponseInterface<WordInterface>
          if(!response.error){
            words.push(response.data)
          }
        }


      }else{
        words = this.words
      }

      setTimeout(() => {
        this.isRegistering = false
        this.$store.dispatch("updateWordList",words).then(()=>{
          this.goTo(appRouter.play)
        })
      }, 1500)

    } catch (e) {
       console.log(e);
    }finally {
      this.isRegistering = false
    }

  }
  async onFileSelected (event:any): Promise<void> {
    const file = event.target.files[0]
    if (!file) return

    this.getFileSheets(file,sheets=>{this.getWordsFromSheet(sheets)},error =>  console.log(error));
  }
  async getWordsFromSheet(sheets:Array<never>): Promise<void>{
    const  main = "deutsch"
    const translation = "Vokabeln"
    sheets.forEach((sheet:Array<Record<string,never>>) =>{
         sheet.forEach((row)=>{
          const word: WordInterface = {
            word : row[this.fileStructure.word.fieldName],
            english : row[this.fileStructure.translation.fieldName],
            language:LanguageList.DEUTSCH,
            id:"0",
            level:"1",
            definition:row[this.fileStructure.tip.fieldName] ?? row[this.fileStructure.translation.fieldName]

          }
          if(word.word){
            this.words.push(word)
          }



        })
     })
     this.visibleView = 2


  }
  getFileSheets<T>(file:File,onComplete:(sheets:Array<never>)=>void,onError:(error:never)=>void):void{
    try {
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e: any) => {
        const binaryString: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binaryString, {type: 'binary'});
        const sheets = []
        for (let index = 0; index < wb.SheetNames.length; ++index) {
          const wsName: string = wb.SheetNames[index]
          const ws: XLSX.WorkSheet = wb.Sheets[wsName]
          const sheet = XLSX.utils.sheet_to_json(ws)
          if (sheet.length > 0) {
            sheets.push(sheet)
          }
        }
        onComplete(sheets as Array<never>);


      }
    } catch (e) {
      onError(e as never)
    }

  }

  GoBAck ():void{
    window.history.length > 1 ? this.$router.go(-1) : this.$router.push(appRouter.home);
  }
  /**
   Life-Hook
   **/
  mounted():void {
      setTimeout(() =>{this.selectionDialog =  true},500)

  }
  goTo(route:appRouter):void{
    this.$router.push(route)
  }

  /** Methods & watchers
   //@Watch('trigger')
   //onPropertyChanged(flag:boolean,oldFlag:boolean){}
   */




}
</script>


<style scoped>
.centered-item {
  display:grid;
  align-items: center;
  justify-content: center;
}


</style>