import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Song } from 'src/app/models/song';
import { SongService } from 'src/app/services/song/song-service.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  private song = null;
  private songLoaded: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songServ: SongService,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.songServ.getSong(id).then((data) => {
      this.song = data;
    });
    this.presentLoading();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loader',
      message: 'Loading Song',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    if(this.song == null)
    {
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      this.song = this.songServ.getSong(id);
      this.presentLoading();
    } else {
      this.songLoaded = true;
    }
    console.log('Loaded!');
  } 
}
