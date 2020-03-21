<template>
  <div id="app">
    <Header></Header>
    <Nav></Nav>
    <keep-alive>
      <router-view></router-view>
      <transition
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      >
        <router-view name="second"></router-view>
      </transition>
    </keep-alive>
    <!-- 播放器组件 -->
    <Player></Player>
  </div>
</template>
<script>
import Header from "./components/Header";
import Nav from "./components/Nav";
import Player from "components/Player";
export default {
  components: { Header, Nav, Player }
};
</script>

<style lang="less">
@import "./style/index.less";
#app {
  .w(375);
  height: 100vh;
  background: @bg;
}
.mint-indicator-wrapper {
  font-size: 30px;
  height:62px;
}
</style>
