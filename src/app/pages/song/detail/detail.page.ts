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
  public isFavorite: boolean = false;
  private _id : string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private songServ: SongService,
    private loadingController: LoadingController,
    private admobServ: AdmobService
  ) {}

  ngOnInit() {
    this.admobServ.showBanner();

    this._id = this.activatedRoute.snapshot.paramMap.get('id');
    this.songServ.getSong(this._id).then((data) => {
      this.song = data;
    });

    if (this.admobServ.isPrepareReward) {
      if (this.songServ.songCount >= environment.songLimitForReward) {
        this.admobServ.showReward();
        this.songServ.resetSongCount();
      }
    } else {
      this.admobServ.prepareReward();
    }


    if (this.admobServ.isInterestialLoaded) {
      if (this.songServ.songCount >= environment.songLimitForAds) {
        if (this.songServ.songCount !== environment.songLimitForReward) {
          this.showVideo();
        }
      }
    } else {
        this.prepareVideo();
    }

    

    this.presentLoading();
  }

  ionViewWillEnter()
  {
    this.songServ.checkIsFavorite(this._id).then((data) => {
      this.isFavorite = data;
    })
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
      this.song = this.songServ.getSong(this._id);
      this.presentLoading();
    } else {
      this.songLoaded = true;
    }
    console.log('Loaded!');
  }

  private prepareVideo() {
    this.admobServ.prepareShortVideo().then((res) => {
      let status = this.admobServ.isInterestialLoaded;
      if (status) {
        this.showVideo();
      }
    });
  }

  private showVideo() {
    this.admobServ.showShortVideo();
    this.songServ.resetSongCount();
    this.admobServ.prepareShortVideo(); // Prepare Another One
  }

  public saveToFavorite()
  {
    this.songServ.saveToFavorite(this._id);
    this.isFavorite = true;
  }

  public removeFromFavorite()
  {
    this.songServ.removeFromFavorite(this._id);
    this.isFavorite = false;
  }
}
