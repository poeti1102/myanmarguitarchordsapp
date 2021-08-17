import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Song } from 'src/app/models/song';
import { SongService } from 'src/app/services/song/song-service.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
})
export class SongPage implements OnInit {
  private songs: Song[] = [];
  private searchString: string = '';

  constructor(
    private songServ: SongService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.songs = this.songServ.getSongs();
  }

  toDetail(id) {
    this.navCtrl.navigateForward(`/song/detail/${id}`);
  }

  searchSong() {
    this.songs = [];
    this.songServ.searchSong(this.searchString).then((data) => {
      this.songs = data;
    });
    this.presentLoading()
  }

  async presentLoading(timer = 1000) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loader',
      message: 'Loading Song',
      duration: timer
    });
    await loading.present();

    if(this.songs == [] || this.songs == null)
    {
      this.presentLoading(500);
    }

    const { role, data } = await loading.onDidDismiss();
    console.log('Loaded!');
  } 
}
