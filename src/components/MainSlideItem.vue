<template>
    <div class="slide_item" :style="{
        'width': reWidth + 'px',
        'left': position + 'px'
    }">
        <div class="border">
            <a :href="item.info.url" target="_blank" @focus="$emit('focus', $event, index);" @blur="$emit('blur')" :tabindex="isOriginal ? '' : '-1'" :style="{
                'background-image':'url(' + item.info.image +')'
            }">
                <div class="center">
                    <div class="txt_box">
                        <p class="tit">{{item.title}}</p>
                        <p class="summary">{{item.title}}</p>
                        <p class="goto">바로가기</p>
                    </div>
                </div>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    import {Watch, Component, Prop, Vue } from 'vue-property-decorator';
    import {dataInterface} from '@/model/slideModel';


    @Component({
        computed:{
            position():number{
                if(this.isMobile)//(넓이 * 80%) * (맨뒤 복제 아이템 - 1) + (넓이 * 20% / 2 - 여백 절반값)
                    return (this.width * 0.8) * (this.index - 1) + (this.width *0.2/2 - 10)
                else
                    return this.width * (this.index - 1)
            },
            reWidth():number{
                if(this.isMobile)
                    return this.width * 0.8 - 20
                else
                    return this.width
            },
            isOriginal():boolean{
                return this.index >= 1 && this.original >= this.index
            }
        }
    })
    export default class MainSlide extends Vue {
        @Prop() item?:dataInterface
        @Prop() index?:number;
        @Prop() width?:number;
        @Prop() original?:number;
        @Prop() isMobile?:boolean;
    }
</script>