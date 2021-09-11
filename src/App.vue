<template>
  <v-app dark>
    <v-main :style="`background-color:${this.color.background}`">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {UserStats, WordInterface} from "@/models/ModelInterface";
import DataBase, {TABLE_NAME} from "@/store/DataBase";


export default Vue.extend({
  name: 'App',

  components: {

  },
  computed: {
    color(){
      return this.$store.getters.colors
    },
    isSessionActive(){
      return this.$store.state.isSessionActive
    }
  },
  watch:{
    isSessionActive(flag:boolean){
      console.log("Changed")
      if(flag)
          this.$router.replace("/home")
      else
        this.$router.replace("/")
    }
  },
  data: () => ({
    //
  }),

  methods: {

    async getUserStats(){
      const stats  = await DataBase.READ_FROM_DB<UserStats>(TABLE_NAME.USER_STATS,"id",'8359630141')
      if(stats?.id && stats?.stats){
        this.$store.dispatch("updateUserStats",stats).then((res)=>{
          // console.log(`Res \n`, res)
        });
      }
    },
    onCreate() {
      if(this.isSessionActive) {
        this.getUserStats();
        this.$router.replace("/home")
      }
    //   const word:WordInterface = {
    //     id: "1",
    //     word: "Gutt",
    //     english:"Good",
    //     definition:"Feeling",
    //     right:1,
    //     attempts:2,
    //     pt:"Bom",
    //     level:"1",
    //     language:"German"
    //   }
    //   DataBase.insertInto<WordInterface>(TABLE_NAME.WORDS,word)
    },

  },
  mounted() {
    this.onCreate()
  },
  beforeCreate() {

    DataBase.openDb();
  }
});
</script>
<style>
  html, body{
    height: 100%;
    background-color:#1C2831;
  }
</style>
