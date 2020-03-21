function normalData(data){
  // 处理数据
  let obj = {'热':[]}
  data.forEach((item,index)=>{
    let {Findex,Fsinger_mid,Fsinger_name,Fother_name} = item
    let avatar =`https://y.gtimg.cn/music/photo_new/T001R300x300M000${Fsinger_mid}.jpg?max_age=2592000`
    let singerItem = {Findex,Fsinger_mid,Fsinger_name,Fother_name,avatar}
    if(index<10){
        obj['热'].push(singerItem)
    }
    if(!obj[Findex]){
      //如果首字母数组不存在就创建,并把该歌手放进去
      obj[Findex]=[singerItem]
    }else{
      //反之存在，就加入到该首字母数组中
      obj[Findex].push(singerItem)
    }
  })
  let hot = [] // 放热门的数组
  let other = [] // 放首字母是英文的数组
  for (const key in obj) {
    if(key == '热'){
      hot.push({Findex:key,list:obj[key]})
    }else if (key != 9){
      other.push({Findex:key,list:obj[key]}) // 格式 {Findex:'A',list:[{a1},{a2}]}
    }
  }
  // 按照首字母排序
  other.sort((a,b)=>{
    return a.Findex.charCodeAt()-b.Findex.charCodeAt()
  })
  // 把热门也拼接回去,并返回
  return hot.concat(other);
}

export { normalData }