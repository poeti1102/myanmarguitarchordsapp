import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Song } from 'src/app/models/song';
import { SongService } from 'src/app/services/song/song-service.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.page.html',
  styleUrls: ['./songs.page.scss'],
})
export class SongsPage implements OnInit {
  public songs: Song[] = [];

  constructor(
    private songServ: SongService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('authorId');
    this.songServ.getByAuthor(id).then((data) => {
      this.songs = data;
    })
    this.presentLoading();
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

    if(this.songs == [] || this.songs == null)
    {
      this.presentLoading(500);
    }

    const { role, data } = await loading.onDidDismiss();
    console.log('Loaded!');
  } 

}
