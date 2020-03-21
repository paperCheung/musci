import axios from '../utils/axios'
import jsonp from 'jsonp'

/*******************************推荐*********************************/
// 推荐页轮播图
let getBannerData = () => {
  let url = '/gdou/music/api/getTopBanner?g_tk=1928093487&inCharset=utf8&outCharset=utf-8&notice=0&format=json&platform=yqq.json&hostUin=0&needNewCode=0&-=recom012845016368453477&data=%7B%22comm%22:%7B%22ct%22:24%7D,%22category%22:%7B%22method%22:%22get_hot_category%22,%22param%22:%7B%22qq%22:%22%22%7D,%22module%22:%22music.web_category_svr%22%7D,%22recomPlaylist%22:%7B%22method%22:%22get_hot_recommend%22,%22param%22:%7B%22async%22:1,%22cmd%22:2%7D,%22module%22:%22playlist.HotRecommendServer%22%7D,%22playlist%22:%7B%22method%22:%22get_playlist_by_category%22,%22param%22:%7B%22id%22:8,%22curPage%22:1,%22size%22:40,%22order%22:5,%22titleid%22:8%7D,%22module%22:%22playlist.PlayListPlazaServer%22%7D,%22new_song%22:%7B%22module%22:%22newsong.NewSongServer%22,%22method%22:%22get_new_song_info%22,%22param%22:%7B%22type%22:5%7D%7D,%22new_album%22:%7B%22module%22:%22newalbum.NewAlbumServer%22,%22method%22:%22get_new_album_info%22,%22param%22:%7B%22area%22:1,%22sin%22:0,%22num%22:10%7D%7D,%22new_album_tag%22:%7B%22module%22:%22newalbum.NewAlbumServer%22,%22method%22:%22get_new_album_area%22,%22param%22:%7B%7D%7D,%22toplist%22:%7B%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:%7B%7D%7D,%22focus%22:%7B%22module%22:%22QQMusic.MusichallServer%22,%22method%22:%22GetFocus%22,%22param%22:%7B%7D%7D%7D'

  // return new Promise((reslove, reject) => {
  //   axios.get(url).then((res) => {
  //     reslove(res)
  //   }).catch((err) => {
  //     reject(err)
  //   })
  // })

  // 由于axios 直接返回一个promise对象 所以不用新建一个promise了
  return axios.get(url)
}

// 推荐页热门歌单
let getRecommendListData = () => {
  let url = '/gdou/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.3983624931217431'
  return axios.get(url)
  // return new Promise((reslove, reject) => {
  //   axios.get(url).then((res) => {
  //     reslove(res)
  //   }).catch((err) => {
  //     reject(err)
  //   })
  // })
}

/*******************************歌手*********************************/
// 歌手页歌手名单
let getSingersData = () => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq'
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'jsonpCallback'
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}


/*******************************排行*********************************/
// 排行页歌单
let getRankData = () => {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5'
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'jsonpCallback'
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}


/*******************************搜索*********************************/
// 搜索页热门搜索
let getHotKeyData = () => {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5'
  return new Promise((resolve, reject) => {
    jsonp(url, {
      param: 'jsonpCallback'
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// 搜索列表
let getSearchListData = (val, page) => {
  let url = `/gdou/music/api/search?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&w=${val}&p=${page}&perpage=20&n=20&catZhida=1&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5`
  return axios.get(url);
}

/***************************获取详情页 歌曲 歌词********************************/

// 歌单（歌手）详情页数据
let getDetailData = (url, method) => {
  if (method == 'jsonp') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: 'jsonpCallback'
      }, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }else if(method == 'axios'){
    return axios.get(url)
  }
}

// 获取歌曲播放地址
let getSongUrlByMid = (mids) => {
  let url = '/laofang/fcj/music/songurl'
  return axios.post(url, {
    mids
  })
}

// 获取歌词
let getSongLyricBySongmid = (songmid) => {
  let url = '/laofang/fcj/music/lyric'
  return axios.post(url, {
    songmid
  })
}


export {
  getBannerData,
  getRecommendListData,
  getSingersData,
  getRankData,
  getHotKeyData,
  getSearchListData,
  getDetailData,
  getSongUrlByMid,
  getSongLyricBySongmid
}
