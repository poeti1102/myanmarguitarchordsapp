import { Injectable } from '@angular/core';

import axios from 'axios';
import { Author } from 'src/app/models/author';
import {
  environment,
  APP_URL,
  API_KEY,
} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private authors : Author[]
  private config: any = {
    headers: { Authorization: `Bearer ${API_KEY}` , 'Content-Type' : 'text/plain'}
  };

  constructor() { }

  async getAuthors()
  { 
    this.authors = [];
    await this.getAuthorList()
    return this.authors;
  }

  async searchAuthor(searchString)
  { 
    this.authors = [];
    await this.search(searchString)
    return this.authors;
  }

  private async getAuthorList() {
    await axios
      .get(`${APP_URL}/authors/list`, this.config)
      .then(async (res) => {
        if (res.data) {
          await this.addAuthors(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  private async search(searchTerm) {
    console.log(searchTerm);
    
    let data = {
      "searchTerm" : searchTerm
    }
    
    await axios
      .post(
        `${APP_URL}/authors/search`,
        data,
        this.config
      )
      .then((res) => {
        if (res.data) {
          this.addAuthors(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  private async addAuthors(Authors: any[]) {
    await Authors.map((author) => {
      let data = {
        id: author.id,
        author_name_en: author.author_name_en,
        author_name_mm: author.author_name_mm,
      };
      this.authors.push(data);
    });
  }


}
