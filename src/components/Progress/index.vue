<template>
  <div class="progress">
    <span>{{time|handleTime}}</span>
    <div class="progress-wrapper" ref="proWrapper" @click="clickProgress">
      <div class="progress-length" ref="proLength"></div>
      <div
        class="dot-btn"
        ref="dot"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      ></div>
    </div>
    <span>{{endTime|handleTime}}</span>
  </div>
</template>

<script>
export default {
  props: {
    startTime: { type: Number, default: 0 },
    endTime: { type: Number, default: 0 }
  },
  data() {
    return {
      time: 0
    };
  },
  mounted() {
    this.proLengthLeft = this.$refs.proWrapper.getBoundingClientRect().left; // 该元素距离设备最左侧的left值( 进度条距离左边的位置 )
  },
  methods: {
    touchStart(e) {
      this.touch = true;
      this.distance = 0;
    },
    touchMove(e) {
      let width = this.$refs.proWrapper.clientWidth;
      this.distance = e.touches[0].pageX - this.proLengthLeft;
      if (this.distance <= 0) {
        this.distance = 0;
      } else if (this.distance >= width) {
        this.distance = width;
      }
      this.offsetMove(this.distance);
    },
    touchEnd(e) {
      this.touch = false;
      this.offsetMove(this.distance);
    },
    clickProgress(e) {
      // 点击进度条跳转
      let x = e.pageX;
      let distance = x - this.proLengthLeft;
      this.offsetMove(distance);
    },
    offsetMove(distance) {
      let precent = (distance / this.$refs.proWrapper.clientWidth) * 100; // 移动的距离占总长度的百分比
      this.$refs.proLength.style.width = precent + "%"; // 进度条的移动
      this.$refs.dot.style.transform = `translateX(${distance}px)`; // 小圆点的位移
      this.time = (this.endTime * precent) / 100;
      if (this.touch) {
        return false;
      }
      this.jump(precent);
    },
    jump(precent) {
      // 歌曲快进到指定部分
      let time = (this.endTime * precent) / 100;
      this.$emit("seekPro", time); // 调用父组件的方法，把歌曲进行快进
    }
  },
  filters: {
    handleTime(data) {
      let time = parseInt(data);
      let min = parseInt(time / 60);
      let s = time % 60;
      return `${min < 10 ? "0" + min : min}:${s < 10 ? "0" + s : s}`;
    }
  },
  watch: {
    startTime() {
      if (this.touch) {
        return false;
      }
      this.time = this.startTime;
      let precent = (this.startTime / this.endTime) * 100; // 播放的占总长的百分比
      this.$refs.proLength.style.width = precent + "%";
      let move = (this.$refs.proWrapper.clientWidth * precent) / 100;
      this.$refs.dot.style.transform = `translateX(${move}px)`;
    }
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
.progress {
  .w(375);
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: @fs-s;
  position: absolute;
  bottom: 80px;
  span {
    display: inline-block;
    width: 38px;
    text-align: center;
    color: #fff;
  }
  .progress-wrapper {
    .w(240);
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    position: relative;
    margin: 0 15px;
    .progress-length {
      height: 4px;
      width: 0%;
      background: @yellow;
    }
    .dot-btn {
      width: 16px;
      height: 16px;
      background: @yellow;
      border: 3px solid #fff;
      border-radius: 50%;
      position: absolute;
      top: -6px;
      left: -8px;
    }
  }
}
</style>