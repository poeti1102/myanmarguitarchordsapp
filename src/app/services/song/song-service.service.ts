import { Injectable } from '@angular/core';
import { Song } from 'src/app/models/song';

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
  private config: any = {
    headers: { Authorization: `Bearer ${API_KEY}` , 'Content-Type' : 'text/plain'}
  };

  constructor() {}

  getSongs(): Song[] {
    this.songs = [];
    this.getSongList();
    return this.songs;
  }

  async getSong(id) {
    this.song = null;
    await this.getsong(id);
    return this.song;
  }

  async searchSong(searchTerm) {
    this.songs = [];
    await this.search(searchTerm);
    return this.songs;
  }

  getPopular() {
    this.songs = [];
    this.getPopularSongs();
    return this.songs;
  }

  getNew() {
    this.songs = [];
    this.getNewSongs();
    return this.songs;
  }

  getByAuthor(authorId) {
    this.songs = [];
    this.getSongsByAuthor(authorId);
    return this.songs;
  }

  getByAlbum(albumId) {
    this.songs = [];
    this.getSongsByAlbum(albumId);
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

  private getSongList() {
    axios
      .get(`${APP_URL}/songs/list`, this.config)
      .then((res) => {
        if (res.data.data.length > 0) {
          this.addSongs(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  }

  private getsong = async(id) : Promise<void> => {
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
  }

  private async search(searchTerm) {
    let data = {
      "searchTerm" : searchTerm
    }
    
    await axios
      .post(
        `${APP_URL}/songs/search`,
        data,
        this.config
      )
      .then((res) => {
        if (res.data) {
          if (res.data.data)
          {
            this.addSongs(res.data.data);
          } else {
            this.addSongs(res.data);
          }
        }
      })
      .catch((err) => console.log(err));
  }

  getPopularSongs() {
    axios
      .get(`${APP_URL}/songs/getPopular`, this.config)
      .then((res) => {
        if (res.data.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  getNewSongs() {
    axios
      .get(`${APP_URL}/songs/getNewSongs`, this.config)
      .then((res) => {
        if (res.data.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  getSongsByAuthor(id) {
    axios
      .get(`${APP_URL}/songs/getSongsByAuthor/${id}`, this.config)
      .then((res) => {
        if (res.data.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  getSongsByAlbum(id) {
    axios
      .get(`${APP_URL}/songs/getSongsByAlbum/${id}`, this.config)
      .then((res) => {
        if (res.data.data) {
          this.addSongs(res.data);
        }
      })
      .catch((err) => console.log(err));
  }
}
