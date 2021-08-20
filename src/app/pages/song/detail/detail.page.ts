import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Song } from 'src/app/models/song';
import { AdmobService } from 'src/app/services/admob/admob.service';
import { SongService } from 'src/app/services/song/song-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public song = null;
  public songLoaded: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songServ: SongService,
    private loadingController: LoadingController,
    private admobServ: AdmobService
  ) {}

  ngOnInit() {
    this.admobServ.showBanner();
    if (this.admobServ.isInterestialLoaded) {
      this.showVideo();
    } else {
      this.prepareVideo();
    }

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
      duration: 1000,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    if (this.song == null) {
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      this.song = this.songServ.getSong(id);
      this.presentLoading();
    } else {
      this.songLoaded = true;
    }
    console.log('Loaded!');
  }

  private prepareVideo() {
    let songCount = this.songServ.songCount;
    if (songCount > environment.songLimitForAds) {
      this.admobServ.prepareShortVideo().then((res) => {
        let status = this.admobServ.isInterestialLoaded;
        if (status) {
          this.showVideo();
        }
      });
    }
  }

  private showVideo() {
    this.admobServ.showShortVideo();
    this.songServ.resetSongCount();
    this.admobServ.prepareShortVideo(); // Prepare Another One
  }
}
