import { Injectable } from '@angular/core';
import { Song } from 'src/app/models/song';
import { Storage } from '@capacitor/storage';

import axios from 'axios';
import {
  environment,
  APP_URL,
  API_KEY,
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private songs: Song[] = [];
  private song: Song = null;
  private _songCount: number = 0;
  private _isFavorite: boolean = false;
  private _favoriteSongs: Song[] = [];
  private _favoriteList = [];

  private config: any = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'text/plain',
    },
  };

  constructor() {}

  async getSongs(page = 1) {
    this.songs = [];
    await this.getSongList(page);
    return this.songs;
  }

  async getSong(id) {
    this.song = null;
    this._songCount++;
    await this.getsong(id);
    return this.song;
  }

  get songCount() {
    return this._songCount;
  }

  resetSongCount() {
    this._songCount = 0;
  }

  async searchSong(searchTerm) {
    this.songs = [];
    await this.search(searchTerm);
    return this.songs;
  }

  async getPopular() {
    this.songs = [];
    await this.getPopularSongs();
    return this.songs;
  }

  async getNew() {
    this.songs = [];
    await this.getNewSongs();
    return this.songs;
  }

  async getByAuthor(authorId) {
    this.songs = [];
    await this.getSongsByAuthor(authorId);
    return this.songs;
  }

  async getByAlbum(albumId) {
    this.songs = [];
    await this.getSongsByAlbum(albumId);

    return this.songs;
  }

  async getFavorite() {
    this.songs = [];
    await this.getFavoriteSongs();

    return this.songs;
  }

  private addSongs(Songs: any[]) {
    Songs.map((song) => {
      let data = {
        id: song.id,
        album: song.album,
        author: song.author,
        song_name_en: song.song_name_en,
        song_name_mm: song.song_name_mm,
        view_count: song.view_count,
        file: song.file,
        is_new: song.is_new,
        is_popular: song.is_popolar,
      };
      this.songs.push(data);
    });
  }

  private async getSongList(page) {
    await axios
      .get(`${APP_URL}/songs/list?page=${page}`, this.config)
      .then((res) => {
        if (res.data.data) {
          this.addSongs(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  }

  private getsong = async (id): Promise<void> => {
    await axios
      .get(`${APP_URL}/songs/get/${id}`, this.config)
      .then((res) => {
        let data = res.data;
        if (data) {
          this.song = {
            id: data.id,
            album: data.album,
            author: data.author,
            song_name_en: data.song_name_en,
            song_name_mm: data.song_name_mm,
            file: data.file,
            view_count: data.view_count,
            is_new: data.is_new,
            is_popular: data.is_popolar,
          };
        }
      })
      .catch((err) => console.log(err));
  };

  private async search(searchTerm) {
    let data = {
      searchTerm: searchTerm,
    };

    await axios
      .post(`${APP_URL}/songs/search`, data, this.config)
      .then((res) => {
        if (res.data) {
          if (res.data.data) {
            this.addSongs(res.data.data);
          } else {
            this.addSongs(res.data);
          }
        }
      })
      .catch((err) => console.log(err));
  }

  private async getPopularSongs() {
    await axios
      .get(`${APP_URL}/songs/getPopular`, this.config)
      .then((res) => {
        if (res.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  private async getNewSongs() {
    await axios
      .get(`${APP_URL}/songs/getNewSongs`, this.config)
      .then((res) => {
        if (res.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  async getSongsByAuthor(id) {
    await axios
      .get(`${APP_URL}/songs/getSongsByAuthor/${id}`, this.config)
      .then((res) => {
        if (res.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  async getSongsByAlbum(id) {
    await axios
      .get(`${APP_URL}/songs/getSongsByAlbum/${id}`, this.config)
      .then((res) => {
        if (res.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  async getFavoriteSongs() {
    const favoriteList = await Storage.get({ key: 'favorite' });
    let data = {
      ids: JSON.parse(favoriteList.value),
    };

    await axios
      .post(`${APP_URL}/songs/getFavorites`, data, this.config)
      .then((res) => {
        if (res.data) {
          if (res.data.data) {
            this.addSongs(res.data.data);
          } else {
            this.addSongs(res.data);
          }
        }
      })
      .catch((err) => console.log(err));
  }

  checkIsFavorite = async (id) => {
    const favoriteList = await Storage.get({ key: 'favorite' });
    if (favoriteList.value == null) {
      this._isFavorite = false;
    } else {
      let list = JSON.parse(favoriteList.value);
      console.log('check',list);
      
      this._isFavorite = list.includes(id);
    }

    return this._isFavorite;
  };

  saveToFavorite = async (id) => {
    let data = [];
    const favoriteList = await Storage.get({ key: 'favorite' });
    if (favoriteList.value !== null) {
      let list = JSON.parse(favoriteList.value);
      list.push(id);
      data = list;
    } else {
      data.push(id)
    }

    await Storage.set({
      key: 'favorite',
      value: JSON.stringify(data),
    });
  };

  removeFromFavorite = async (id) => {
    let data = [];
    const favoriteList = await Storage.get({ key: 'favorite' });
    console.log(favoriteList.value);
    if (favoriteList.value !== null) {
      data = JSON.parse(favoriteList.value);
    }
    
    const newList = data.filter((songId) => {
      return songId !== id
    })
    console.log(newList);
    
    await Storage.set({
      key: 'favorite',
      value: JSON.stringify(newList),
    });
  };
}
