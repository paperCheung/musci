function normalSearchListData(list){
  let result = []
  let mids = [] // 存放songmid 为后面存放播放音乐地址做准备
  result = list.map((item,index)=>{
    let { albummid, albumname, singer, songmid, songname,songid } = item
    let albumUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
    mids.push(songmid)
    return {albummid, albumname, singer, songmid, songname,albumUrl,songid}
  })
  return {result, mids}
}

export {normalSearchListData}