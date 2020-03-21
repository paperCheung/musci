<template>
  <div class="header">
    <img src="/logo.png" alt />
    <span>LittleBear Music</span>
    <div class="mine iconfont" @click="goMine">&#xe638;</div>
  </div>
</template>
<script>
import router from '../../router'
export default {
  methods: {
    goMine() {
      router.push("user");
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../style/index.less";
.header {
  color: @yellow;
  font-size: @fs-l;
  display: flex;
  justify-content: center;
  align-items: center;
  .w(375);
  height: 44px;
  .mine{
    font-size:@fs-xl;
  }
  img {
    width: 30px;
    height: 32px;
    margin-right: 9px;
  }
  .mine {
    width: 44px;
    height: 44px;
    position: absolute;
    right: 0px;
    text-align: center;
    line-height: 44px;
  }
}
</style>