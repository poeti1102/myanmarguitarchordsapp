import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize,
  AdOptions,
  AdLoadInfo,
  InterstitialAdPluginEvents,
} from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root',
})
export class AdmobService {
  private _isInterestialLoaded: boolean = false;

  /**
   * Height of AdSize
   */
  private appMargin = 0;

  constructor() {}

  initialize() {
    AdMob.initialize({
      requestTrackingAuthorization: false,
    });
  }

  async showBanner(): Promise<void> {
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      // Subscribe Banner Event Listener
    });

    AdMob.addListener(
      BannerAdPluginEvents.SizeChanged,
      (size: any) => {
        // Subscribe Change Banner Size
        this.appMargin = parseInt(size.height, 10);
        if (this.appMargin > 0) {
          const app: HTMLElement = document.querySelector('ion-router-outlet');
          app.style.marginBottom = this.appMargin + 'px';
        }
      }
    );

    const options: BannerAdOptions = {
      adId: environment.admobId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: !environment.production,
      // npa: true
    };
    AdMob.showBanner(options);
  }

  async prepareShortVideo(): Promise<void> {
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => { 
    });

    const options: AdOptions = {
      adId: environment.interestialId,
      isTesting: !environment.production,
      // npa: true
    };
    await AdMob.prepareInterstitial(options);
    this._isInterestialLoaded = true;
  }

  showShortVideo() {
    AdMob.showInterstitial();
  }

  get isInterestialLoaded() {
    return this._isInterestialLoaded;
  }
}
