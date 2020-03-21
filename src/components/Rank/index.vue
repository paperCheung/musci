<template>
  <div class="rank">
    <div class="toplist wrapper">
      <ul class="content">
        <li v-for="(item,index) in list" :key="index" class="item" @click='goDetail(item.id,item.topTitle)'>
          <img v-lazy="item.picUrl" alt />
          <div>
            <ul>
              <li v-for="(item,index) in item.songList" :key="index">
                <span>{{index+1}}</span>
                <span>{{item.songname}}-{{item.singername}}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
     <!-- 路由嵌套  排行详情页 -->
    <transition 
        enter-active-class="animated slideInRight"                   
        leave-active-class="animated slideOutRight">
      <router-view :detailName="detailName" :show='true'></router-view>
    </transition>
  </div>
</template>

<script>
import { getRankData } from "api/api.js";
import Bs from "better-scroll";
export default {
  data() {
    return {
      list: [],
      detailName:''
    };
  },
  methods: {
    initBs() {
      new Bs(".wrapper", {click:true});
    },
    goDetail(id, name){
      this.$router.push(`/rank/${id}`)
      this.detailName = name
    }
  },
  created() {
    getRankData().then(res => {
      this.list = res.data.topList;
    });
  },
  mounted() {
    this.initBs();
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
.rank {
  position: fixed;
  top: 88px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  .wrapper {
    overflow: hidden;
    height: 100%;
    ul {
      padding-bottom: 20px;
      .item {
        height: 120px;
        padding-top: 20px;
        margin: 0 20px;
        display:flex;
        img {
          width: 100px;
          height: 100px;
        }
        div {
          flex:1;
          ul {
            height: 100px;
            background: #333;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            li {
              .w(195);
              height: 26px;
              line-height: 26px;
              font-size: @fs-xs;
              color: rgba(255, 255, 255, 0.3);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>