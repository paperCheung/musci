<template>
  <div class="lyric">{{text}}</div>
</template>

<script>
import { getSongLyricBySongmid } from "api/api.js";
import { Base64 } from "js-base64";
import { mapGetters } from "vuex";
import Lyric from "lyric-parser";
export default {
  props: ["play", "seekTime"],
  data() {
    return {
      text: "暂无歌词"
    };
  },
  computed: {
    ...mapGetters(["currentSong"])
  },
  watch: {
    play() {
      if (!this.lyricObj) return false;
      this.lyricObj.togglePlay();
    },
    // 监听歌曲是否发生变化
    currentSong(newSong) {
      let { songmid } = newSong;
      this.text = '暂无歌词'
      this.getLyric(songmid);
    },
    seekTime(newTime) {
      if (!this.lyricObj) return false;
      this.lyricObj.seek(newTime * 1000); // 歌词快进
    }
  },
  methods: {
    getLyric(songmid) {
      getSongLyricBySongmid(songmid).then(res => {
        let decode = Base64.decode(res.lyric); // 对歌词进行base64解码
        // 如果之前有歌词对象，就停止
        if (this.lyricObj) {
          this.lyricObj.stop();
        }
        this.lyricObj = new Lyric(decode, ({ txt }) => {
          this.text = txt;
        });
        // 解析完判断歌曲是否播放状态
        if (this.play) {
          this.lyricObj.play();
        }
      }).catch(res=>{this.text='暂无歌词'});
    }
  },
  mounted() {
    let { songmid } = this.currentSong;
    this.getLyric(songmid);
  }
};
</script>

<style lang="less" scoped>
@import "~style/index.less";
.lyric {
  .w(375);
  height: 40px;
  color: rgba(255, 255, 255, 0.5);
  font-size: @fs-s;
  text-align: center;
  margin: 30px 0;
  padding: 0 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>