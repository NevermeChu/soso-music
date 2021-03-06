import { reactive, provide, inject } from 'vue';
import Storage from "../Storage";

const state = {
  // 用户信息
  user: {
    163: {},
    qq: {},
    soso: {
      ...Storage.get('soso_user', true, '{}'),
      logined: false,
    },
  },
  // 下载信息
  downloadInfo: {
    count: 0, // 正在下载中的歌曲，不算 waiting 状态
  },
  // 搜索信息
  searchInfo: {
    keyword: '',
    type: 0,
    result: {},
    pageNo: 1,
    pageSize: 20,
    total: 0,
    platform: '163',
  },
  // 全部音乐
  allSongs: {},
  // 全部歌单
  allList: {},
  // 喜欢的歌曲
  favSongMap: {
    qq: {},
    163: {},
    migu: {},
  },
  // 播放列表
  playingList: new Proxy({
    random: [],
    raw: [],
    trueList: [],
    history: [],
    index: 0,
  }, {
    get(target, key) {
      return target[key] ? target[key] :
        target.raw.find((aId) => aId === key)
    },
  }),
  // 正在播放的音乐
  playNow: {},
  playerStatus: {
    playing: false,
    loading: true,
  },
  // 下载列表
  downloadList: Storage.get('soso_music_download', true, '[]').map((v) => {
    if (!v.finished) {
      v.finished = true;
      v.waiting = false;
      v.errMsg = '下载中断';
    }
    return v;
  }),
  // 歌单信息和歌单中的歌曲列表，放在这里是为了方便对歌曲收藏取消操作时好同步数据
  listInfo: {},
  // 将歌曲添加到歌单
  handleSong: {
    aId: '',
    selected: '',
    list: [],
  },
  // 发送评论的窗口
  commentInfo: {
    open: false,
    content: '',
    name: '',
    reply: null,
    loading: false,
  },
  router: {
    history: ['/'],
    back: [],
    isBack: false,
    isReBack: false,
  },
  // 系统设置
  setting: {
    path: '',
    mode: 'default', // 模式
    volume: 100, // 音量
    orderType: 'suiji',
    tab: 'default',
    DOWN_SIZE: 'flac', // 下载格式
    LISTEN_SIZE: '128', // 播放格式
    DOWN_LYRIC: true, // 下载歌词
    DOWN_FILTER: false,
    DOWN_NAME: '1', // 下载文件名类型
    DOWN_TRANS: true, // 下载歌词翻译
    DOWN_DIR: '', // 下载路径
    qCookie: '',
    SERVER_PORT: '3090',
    store_qq: '',
    store_163: '',
    DRAW_MUSIC: true,
    DRAW_MUSIC_TYPE: '1',
    DRAW_MUSIC_STYLE: 'rect',
    appId: (() => {
      const getRandom = (num) => Number(`${num}`.split('').sort(() => Math.random() - 0.5).join('')).toString(36);
      const randomT = getRandom(new Date().valueOf());
      const randomN = getRandom(Math.round(Math.random() * 99999));
      return randomN + randomT;
    })(),
    codeMap: {
      PLAY_NEXT: '39',
      PLAY_PREV: '37',
      VOLUME_UP: '38',
      VOLUME_DOWN: '40',
      PLAY: '32',
      QUIT_SIMPLE: '27',
      TO_SIMPLE: ''
    },
    ...Storage.get('soso_music_setting', true, '{}'),
    platform: '163', // 默认平台
    version: '1.0.0',
    versionType: '',
  },
  miguFind: {...Storage.get('soso_music_migu_find', true, '{}')}
}

const result = {};

Object.keys(state).forEach(k => result[k] = [k, reactive(state[k])])

const mixHandle = (type, keys) => {
  const func = { provide, inject }[type];
  const obj = {};
  const singleProvide = (k) => {
    if (!result[k]) {
      return;
    }
    obj[k] = func(...result[k]);
    if (type === 'provide')
      obj[k] = result[k][1]
  }
  if (typeof keys === 'string') {
    singleProvide(keys)
  } else if (Array.isArray(keys)) {
    keys.forEach(k => singleProvide(k))
  }
  return obj;
}

export const mixProvide = (keys) => mixHandle('provide', keys);

export const mixInject = (keys) => mixHandle('inject', keys);

export const allProvide = () => mixProvide(Object.keys(state));


export default result;