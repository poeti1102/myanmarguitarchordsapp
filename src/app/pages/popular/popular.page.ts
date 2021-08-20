import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { SongService } from 'src/app/services/song/song-service.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.page.html',
  styleUrls: ['./popular.page.scss'],
})
export class PopularPage implements OnInit {
  public songs;
  constructor(
    private songServ: SongService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.presentLoading(500);
    this.songServ.getPopular().then((data) => {
      this.songs = data;
    });
  }

  toDetail(id) {
    this.navCtrl.navigateForward(`/song/detail/${id}`);
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
