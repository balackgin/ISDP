<template>
  <div class="flex">
    <div class="flex-auto"
         v-for="item of fonts"
         :key="item">
      <span class="fab icon"
            :class="[item]"></span>
      <span class="fas icon"
            :class="[item]"></span>
      <p class="text">fab/fas {{item}}</p>
    </div>
  </div>
</template>
<script>
import fonts from './fontawesome';
export default {
  data(){
    return {
      fonts
    }
  }
}
</script>
<style lang="less" scoped>
  .flex {
    padding: 20px;
    flex-wrap: wrap;
    .flex-auto {
      width: 20%;
      flex-basis: 20%;
      margin-bottom: 20px;
      .icon {
        margin-right: 8px;
        color: #333;
        font-size: 18px;
      }
      .text {
        margin-top: 6px;
        color: #666;
        font-size: 12px;
      }
    }
  }
</style>
