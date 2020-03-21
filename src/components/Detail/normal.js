function normalDetailData(data,mark){
  let result = []
  let mids = [] // 存放songmid 为后面存放播放音乐地址做准备
  let list = []
  switch (mark) {
    case 'recdetail':
      list = data.cdlist[0].songlist
      result = list.map((item,index)=>{
        let { albummid, albumname, singer, songmid, songname, songid } = item
        let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
        mids.push(songmid)
        return {albummid, albumname, singer, songmid, songname,albumUrl,songid}
      })
      break;
    case 'singerdetail':
    case 'searchdetail':
      list = data.data.list
      result = list.map((item,index)=>{
        let { albummid, albumname, singer, songmid, songname, songid } = item.musicData
        let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
        mids.push(songmid)
        return {albummid, albumname, singer, songmid, songname,albumUrl,songid}
      })
      break;
    case 'rankdetail':
      list = data.songlist
      result = list.map((item,index)=>{
        let { albummid, albumname, singer, songmid, songname, songid } = item.data
        let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
        mids.push(songmid)
        return {albummid, albumname, singer, songmid, songname,albumUrl,songid}
      })
      break;
    default:
      break;
  }
  return {result, mids}
}
export {normalDetailData}