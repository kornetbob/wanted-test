<template>
    <div class="slide_conteroller_wrap">
        <button type="button" class="prev" @click="$emit('slide-event', $event, 'prev')" @focus="$emit('focus');" @blur="$emit('blur')"><span class="hidden">뒤로</span></button>
        <button type="button" class="next" @click="$emit('slide-event', $event, 'next')" @focus="$emit('focus');" @blur="$emit('blur')"><span class="hidden">앞으로</span></button>
    </div>
</template>

<script lang="ts">
    import {Watch, Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class MainSlide extends Vue {

    }
</script>