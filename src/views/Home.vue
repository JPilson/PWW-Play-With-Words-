<template>
  <div class="home pa-5">
      <LinearLayout  :background-tint="color.dashCardColor" rounded-corners="10" class="px-2 pt-2"   >
        <v-flex class="d-flex flex-column  align-end justify-center mr-5" >
          <TextView text="Vocabular" size="12"/>
          <TextView :text="$store.getters.wordList.length"   style="transform: translateY(-10px) "
                    color="white" size="12" bold/>
        </v-flex>
        <LinearLayout horizontal-orientation class="justify-space-around">
          <div v-for="(info, index) in dashBoardInfo" :key="`dash_info${index}`">
            <TextView :text="info.field" bold/>
            <TextView :text="info.value" bold size="30" spacing="-2" style="transform: translateY(-10px) "
                      color="white"/>
          </div>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout  :background-tint="color.card" rounded-corners="10" class="px-5 py-3 mt-5 "  >
          <LinearLayout horizontal-orientation  class="align-center my-3" v-for="(rank,index ) in 5" :key="`rank#${index}`" >
              <v-avatar size="60"  :color="color.background" :style="modifier.shadow(0,10,25,color.rankColor[rank],HexAA.P15)" >

              </v-avatar>
            <LinearLayout class="justify-center mx-5" >
              <TextView text="Joao Sumbo" bold  size="12" :color="color.primaryText"/>
              <TextView  text="Deutsch -  Germany" size="10" style="margin-top: -10px" :color="color.primaryText" />
            </LinearLayout>
            <v-spacer />
            <TextView :text="`#${rank}`" bold size="15" :color="color.rankColor[rank]"/>
          </LinearLayout>

      </LinearLayout>
    <LinearLayout style="position: absolute; bottom:0;left:0;right:0; width:100%" class="mb-5 "  >
      <v-flex xs12  class="mx-3">
        <v-btn :color="color.addVocabButton" block depressed x-large style="border-radius: 15px" @click="goTo(appRouter.register)">
          <TextView text="add vocab" caps bold color="black"/>
        </v-btn>
        <v-btn class="mt-2" @click="goTo(appRouter.play)" :color="color.confirm" block depressed x-large :style="modifier.shadow(0,5,25,color.addVocabButton,HexAA.P50)" style="border-radius: 15px">
          <TextView text="Exercise" caps bold color="black"/>
        </v-btn>
      </v-flex>
    </LinearLayout>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import LinearLayout from "@/utils/UI/LinearLayout/LinearLayout.vue";
import {ColorType,HexAA} from "@/values/Colors";
import TextView from "@/utils/UI/TextView/TextView.vue";
import Modifier from "@/values/Modifier";
import {appRouter} from "@/router";


@Component({
  components: {
    TextView,
    LinearLayout

  },
})
export default class Home extends Vue {
  public appRouter = appRouter
  public dashBoardInfo = [
    {field:"Score",icon:"",value:150},
    {field:"You Know",icon:"",value:150},
    {field:"Attempts",icon:"",value:150},
  ]
  public modifier = Modifier
  public HexAA = HexAA

  get color():ColorType{
    return  this.$store.getters.colors
  }

  goTo(route:appRouter):void{
    this.$router.push(route)
  }




}
</script>

<style scoped lang="scss">

  .shadow{
    box-shadow: 0 10px 30px rgba(215, 54, 54, 0.15);
  }

</style>
