<template>
  <div class="container">
    <MainSlide :slide-data.sync="resultData" :timer="6000"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MainSlide from '@/components/MainSlide.vue';
import Axios from "axios"
import {dataInterface} from '@/model/slideModel'


@Component({
  components: {
    MainSlide,
  },
})
export default class Main extends Vue {
    private resultData?:Array<dataInterface> = [];

    async mounted() {
      let data = await Axios.get('https://s3.ap-northeast-2.amazonaws.com/static.wanted.co.kr/homework/data.json');
      this.resultData = await data.data;
    }
}
</script>
