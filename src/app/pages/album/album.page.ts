import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Album } from 'src/app/models/album';
import { AlbumService } from 'src/app/services/album/album.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
})
export class AlbumPage implements OnInit {
  public albums: Album[] = [];
  public searchString: string = '';

  constructor(
    private albumServ: AlbumService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.albumServ.getAlbums().then((data) => {
      this.albums = data;
    });
    this.presentLoading();
  }

  searchAlbum() {
    this.albums = [];
    this.albumServ.searchAlbum(this.searchString).then((data) => {
      this.albums = data;
    });
    this.presentLoading()
  }

  toSongs(albumId)
  {
    this.navCtrl.navigateForward(`/album/song/${albumId}`);
  }

  async presentLoading(timer = 1000) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loader',
      message: 'Loading...',
      duration: timer
    });
    await loading.present();

    if(this.albums == [] || this.albums == null)
    {
      this.presentLoading(500);
    }

    const { role, data } = await loading.onDidDismiss();
    console.log('Loaded!');
  }

}
