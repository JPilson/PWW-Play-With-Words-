<template>
  <v-app dark>
    <v-main :style="`background-color:${color.background}`">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import {WordInterface} from "@/models/ModelInterface";
import DataBase, {TABLE_NAME} from "@/store/DataBase";


export default Vue.extend({
  name: 'App',

  components: {

  },
  computed: {
    color(){
      return this.$store.getters.colors
    }
  },
  data: () => ({
    //
  }),
  methods: {
    onCreate() {
      const word:WordInterface = {
        id: "1",
        word: "Gutt",
        english:"Good",
        definition:"Feeling",
        right:1,
        attempts:2,
        pt:"Bom",
        level:"1",
        language:"German"
      }
      DataBase.insertInto<WordInterface>(TABLE_NAME.WORDS,word)
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
