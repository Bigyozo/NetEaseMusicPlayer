export type Banner = {
  targetId: number;
  url: string;
  imageUrl: number;
};

export type HotTag = {
  id: number;
  name: string;
  position: number;
};

//单曲
export type Song = {
  id: number;
  name: string;
  url: string;
  ar: Singer[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
};

//播放地址
export type SongUrl = {
  id: number;
  url: string;
};

//歌单
export type SongSheet = {
  id: number;
  userId: number;
  name: string;
  picUrl: string;
  coverImgUrl: string;
  playCount: number;
  tags: String[];
  createTime: number;
  creator: {
    nickname: string;
    avatarUrl: string;
  };
  description: string;
  subscribedCount: number;
  shareCount: number;
  commentCount: number;
  Subscribed: boolean;
  tracks: Song[];
};

export type Singer = {
  id: number;
  name: string;
  picUrl: string;
  albumSize: number;
};

export type SingerDetail = {
  artist: Singer;
  hotSongs: Song[];
};

export type Lyric = {
  lyric: string;
  tlyric: string;
};

export type SheetList = {
  playlists: SongSheet[];
  total: number;
};
