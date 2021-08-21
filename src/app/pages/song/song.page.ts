import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { Song } from 'src/app/models/song';
import { AdmobService } from 'src/app/services/admob/admob.service';
import { SongService } from 'src/app/services/song/song-service.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.page.html',
  styleUrls: ['./song.page.scss'],
})
export class SongPage implements OnInit {
  public songs;
  public searchString: string = '';
  public page : number = 1;
  public canLoadMore : boolean = true;
  public songsLoading : boolean = false;

  constructor(
    private songServ: SongService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private admobServ: AdmobService
  ) {}

  ngOnInit() {
    this.canLoadMore = false;
  }

  ionViewWillEnter() {
    this.songServ.getSongs(this.page).then((data) => {
      this.songs = data;
      this.canLoadMore = true;
    });
    this.presentLoading(500);
    this.admobServ.showBanner();
  }

  toDetail(id) {
    this.navCtrl.navigateForward(`/song/detail/${id}`);
  }

  searchSong() {
    this.songs = [];
    this.songServ.searchSong(this.searchString).then((data) => {
      this.songs = data;
      if(this.searchString == "")
      {
        this.canLoadMore = true;
      }
    });
    this.presentLoading()
  }

  async presentLoading(timer = 1000) {
    
    const loading = await this.loadingCtrl.create({
      cssClass: 'loader',
      message: 'Loading...',
      duration: timer
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  } 

  loadMore()
  {
    this.songsLoading = true;
    this.page++;
    this.songServ.getSongs(this.page).then((data) => {
      if(data.length !== 0)
      {
        data.map((song) => {
          this.songs.push(song);
        })
        this.songsLoading = false;
      } else {
        this.canLoadMore = false;
        this.songsLoading = false;
      }
    });
  }
}
