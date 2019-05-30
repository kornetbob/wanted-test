<template>
  <div class="slide_wrap" @mouseover="slideOver" @mouseout="slideOut" @touchstart="touchEvnt($event)" @touchmove="touchEvnt($event)" @touchend="touchEvnt($event)">
    <div class="slide_track" :style="{
    'width': trackSize + 'px',
    'transform':'translate3d('+motionSize+'px, 0, 0)',
    'transition': isTransition ? 'transform 1000ms ease 0s' : 'transform 0ms'
    }" v-if="resultList">
      <MainSlideItem v-for="(item, idx) in resultList" :item="item" :index="idx" :width="slideWidth" :original="originalTotal" :is-mobile="isMobile" @focus="slideKeyboardEvnt" @blur="slideOut"></MainSlideItem>
    </div>
    <MainSlideController @slide-event="slideController" @focus="slideOver" @blur="slideOut"></MainSlideController>
  </div>
</template>

<script lang="ts">
import {Watch, Component, Prop, Vue } from 'vue-property-decorator';
import {dataInterface} from '@/model/slideModel';
import MainSlideController from './MainSlideController.vue';
import MainSlideItem from "./MainSlideItem.vue"
import Axios from "axios"

@Component({
  components:{
    MainSlideController,
    MainSlideItem
  },
  computed:{
      isMobile():boolean{ //모바일 확인
          return this.slideWidth < 768 ? true : false
      },
      persent():number{ //모바일 경우 사이즈 축소를 위한 값
          return this.isMobile ? 0.8 : 1
      },
      resultList():Array<dataInterface>{ //복제된 목록 개수 포함
          if(!this.originalTotal){
              this.originalTotal = this.slideData.length;
          }
          if(this.slideData.length){
              let result:Array<dataInterface> = this.slideData;
              this.slideData.forEach((item)=>{
                  result.push(item)
              })
              result.unshift(this.slideData[this.slideData.length - 1]);
              return result;
          }
          return [];
      },
      motionSize():number{ //변경된 모션 사이즈
          return this.translate
      }
  }
})
export default class MainSlide extends Vue {
  @Prop() slideData?:Array<dataInterface>;
  @Prop() timer?:number;

  private slideWidth:number = 0; //슬라이드 아이템 넓이
  private trackSize:number = 0; //복제된 슬라이드 아이템 포함 넓이
  private translate:number = 0; //이동해야될 사이즈
  private isTransition:boolean = false; //트렌지션 사용여부
  private slideIdx:number = 0; //현재 index값
  private originalTotal:number = 0; //슬라이드 개수
  private isInterval:boolean = false; //모션 이벤트 실행 여부
  private isMouseOver:boolean = false; //마우스오버 확인 여부
  private isDoubleClick:boolean = false; //컨트롤러 더블클릭 방지
  private touchPosition:number = 0; //모바일 touch start X 위치
  private slideAnimateEvnt:any; //timeout 변수

  @Watch('resultList', {immediate:true})
  cloneDataWatch(n:Array<dataInterface>, o:Array<dataInterface>){
      if(n.length){
          this.trackSize = this.slideWidth * this.resultList.length;
          if(!this.isInterval){
              this.slideAnimate()
              this.isInterval = true;
          }

      }
      return n
  }

  //움직이는 이벤트 실행
  slideAnimate(){
    this.slideAnimateEvnt = setTimeout(()=> {
        this.slideAnimate();
        this.slideController(null, 'next');
    }, this.timer)
  }

  //움직이는 이벤트 종료
  slideStopAnimate(){
      clearTimeout(this.slideAnimateEvnt);
  }

  //피시버전 좌우버튼
  slideController(event:Event | null, position:string){
      if(this.isDoubleClick)
          return;

      const slideWidth = this.slideWidth * this.persent;

      if(position == 'prev'){
          this.slideIdx--;
      }else{
          this.slideIdx++;
      }

      this.translate = - slideWidth * this.slideIdx;

      this.isDoubleClick = true;
      this.isTransition = true;
      this.slideStopAnimate();
      setTimeout(()=>{
          if(position == 'prev'){
              if(-1 >= this.slideIdx){
                  this.slideIdx = this.originalTotal - 1;
                  this.translate = - slideWidth * this.slideIdx;
              }
          }else{
            if(this.slideIdx >= this.originalTotal){
                this.slideIdx = 0;
                this.translate = slideWidth * this.slideIdx
            }
          }

          this.isTransition = false;
          this.isDoubleClick = false;
          if(!this.isMouseOver)
            this.slideAnimate();
      }, 1000);
  }

  //접근성용 이벤트
  slideKeyboardEvnt(e, index:number){
      e.preventDefault();
      const slideWidth = this.slideWidth * this.persent;

      this.slideIdx = index;
      this.translate = - slideWidth * (this.slideIdx - 1);
      this.slideOver();
  }

  slideOver(){
      this.isMouseOver = true;
      this.slideStopAnimate();

  }

  slideOut(){
      this.isMouseOver = false;
      this.slideAnimate();
  }

  //슬라이드 아이템 리사이즈
  slideItemResize(){
    const wrap:Element = document.querySelector(".slide_wrap");
    this.slideWidth = wrap.clientWidth;
    const slideWidth = this.slideWidth * this.persent;
    this.translate = - slideWidth * this.slideIdx;
  }

  //모바일 이벤트
  touchEvnt(e:Event){
      if(!this.isMobile){
          return
      }
      if(e.type == 'touchstart'){
        this.slideStopAnimate();
        this.touchPosition = e.touches[0].pageX;
      }else if(e.type == 'touchmove'){
        this.slideStopAnimate();
        if(e.touches[0].pageX > this.touchPosition){
            console.log("prev");
            this.slideController(null, 'prev');
        }else{
            console.log("next");
            this.slideController(null, 'next');
        }
      }else if(e.type == 'touchend'){
        this.slideAnimate();
          this.touchPosition = 0; //초기화
      }
  }

  mounted(){
      this.$nextTick(()=>{
          //현재 윈도우 사이즈 구하기
          this.slideItemResize();
          window.addEventListener('resize', ()=>{
              this.slideItemResize();
              this.slideStopAnimate();
          }, false);

      })
  }

}
</script>