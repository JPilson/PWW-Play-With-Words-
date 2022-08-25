<template>
<div class="d-flex flex-column align-center justify-center" style="height: 100%" >
  <div class="mx-10" style="width: 80%">
    <vs-input class="my-2" block  color="black" :state="isDark?'dark':'light'" icon-after v-model="userName"
              label-placeholder="User name">
      <template #icon>
        <i class='bx bxl-bitcoin'/>
      </template>
      <template #message-warn v-if="userName.length < 2">
       Required
      </template>
    </vs-input>

    <vs-input  class="my-2" block type="password" :state="isDark?'dark':'light'" icon-after v-model="password"
              placeholder="Password" >
      <template #icon>
        <i class='bx bx-lock-open-alt black'></i>
      </template>
      <template #message-warn v-if="password.length < 3">
        Required
      </template>
    </vs-input>

    <vs-button block size="large" :loading="loading" @click="statSession">
      start session
    </vs-button>
  </div>




</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {ColorType} from "@/values/Colors";
import {LanguageType} from "@/values/Strings";
import {UserInterface} from "@/models/ModelInterface";
import APIPoint from "@/api/APIPoint";

@Component({})
export default class LoginView extends  Vue{
 public userName = ""
  public password = ""
  public  loading = false

  get colors():ColorType {
    return this.$store.getters.colors;
  }

  get strings():LanguageType {
    return this.$store.getters.strings;
  }
  get isDark():boolean {
    return this.$store.getters.isDark;
  }

  statSession():void {
   if(this.userName.length <2 || this.password.length < 3){
     return
   }

   this.loading = true
    const user:UserInterface = {
      name:this.userName,
      email:"email",
      age:23,
      main_lg:"english",
      pwd:this.password
    }
    console.log(`starting`)
    new APIPoint().registerUser(user).then((result: UserInterface)=>{
      console.log(result)
      this.loading = false
    })
    // setTimeout(()=>{
    //   this.loading = false
    //   this.$store.dispatch("updateSession",true).then(()=>{
    //     setTimeout(()=> {
    //       this.$store.dispatch("updateSession",false).then(()=>{
    //         console.log("yep")
    //       })
    //     },7000)
    //   })
    // },2000)
  }

}
</script>

<style scoped>

</style>