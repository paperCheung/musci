<template>
  <div class="nav">
    <router-link to="/recommend" tag="div" active-class="active">
      <span>推荐</span>
    </router-link>
    <router-link to="/singer" tag="div" active-class="active">
      <span>歌手</span>
    </router-link>
    <router-link to="/rank" tag="div" active-class="active">
      <span>排行</span>
    </router-link>
    <router-link to="/search" tag="div" active-class="active">
      <span>搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>
<style lang="less" scoped>
@import "../../style/index.less";
.nav {
  .w(375);
  height: 44px;
  display: flex;
  div {
    font-size: @fs-s;
    color: rgba(255, 255, 255, 0.5);
    width: 25%;
    text-align: center;
    line-height: 44px;
    span {
      display: inline-block;
      height: 38px;
      border-bottom: 2px solid @bg;
    }
  }
  .active {
    color: @yellow;
    span {
      border-bottom: 2px solid @yellow;
    }
  }
}
</style>