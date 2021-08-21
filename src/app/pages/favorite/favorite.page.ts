import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { AdmobService } from 'src/app/services/admob/admob.service';
import { SongService } from 'src/app/services/song/song-service.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {
  public songs;

  constructor(
    private songServ: SongService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private admobServ: AdmobService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.songServ.getFavorite().then((data) => {
      this.songs = data;
    });
    
    this.presentLoading(500);
    this.admobServ.showBanner();
  }

  toDetail(id) {
    this.navCtrl.navigateForward(`/song/detail/${id}`);
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


}
