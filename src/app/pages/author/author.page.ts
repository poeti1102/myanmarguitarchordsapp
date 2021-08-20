import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Author } from 'src/app/models/author';
import { AuthorService } from 'src/app/services/author/author.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.page.html',
  styleUrls: ['./author.page.scss'],
})
export class AuthorPage implements OnInit {
  public authors: Author[] = [];
  public searchString: string = '';

  constructor(
    private authorServ: AuthorService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.authorServ.getAuthors().then((data) => {
      this.authors = data;
    });
    this.presentLoading();
  }

  searchAuthor() {
    this.authors = [];
    this.authorServ.searchAuthor(this.searchString).then((data) => {
      this.authors = data;
    });
    this.presentLoading()
  }

  toSongs(albumId)
  {
    this.navCtrl.navigateForward(`/author/song/${albumId}`);
  }

  async presentLoading(timer = 1000) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loader',
      message: 'Loading...',
      duration: timer
    });
    await loading.present();

    if(this.authors == [] || this.authors == null)
    {
      this.presentLoading(500);
    }

    const { role, data } = await loading.onDidDismiss();
    console.log('Loaded!');
  } 

}
