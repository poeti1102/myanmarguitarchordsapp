import { Injectable } from '@angular/core';
import { Album } from 'src/app/models/album';
import axios from 'axios';
import {
  environment,
  APP_URL,
  API_KEY,
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private albums : Album[]
  private config: any = {
    headers: { Authorization: `Bearer ${API_KEY}` , 'Content-Type' : 'text/plain'}
  };

  constructor() { }

  async getAlbums()
  { 
    this.albums = [];
    await this.getAlbumList()
    return this.albums;
  }

  async searchAlbum(searchString)
  { 
    this.albums = [];
    await this.search(searchString)
    return this.albums;
  }

  private async getAlbumList() {
    await axios
      .get(`${APP_URL}/albums/list`, this.config)
      .then(async (res) => {
        if (res.data) {
          await this.addAlbums(res.data);
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
        `${APP_URL}/albums/search`,
        data,
        this.config
      )
      .then((res) => {
        if (res.data) {
          this.addAlbums(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  private async addAlbums(Albums: any[]) {
    await Albums.map((album) => {
      let data = {
        id: album.id,
        album_name_en: album.album_name_en,
        album_name_mm: album.album_name_mm,
      };
      this.albums.push(data);
    });
  }
}
