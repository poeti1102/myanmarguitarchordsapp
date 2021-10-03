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
   private bannerPosition: 'top' | 'bottom';

  constructor() {}

  initialize() {
    AdMob.initialize({
      requestTrackingAuthorization: false,
    });
  }

  async showBanner(): Promise<void> {
    this.bannerPosition = 'bottom';
    
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      // Subscribe Banner Event Listener
    });

    const resizeHandler = AdMob.addListener(
      BannerAdPluginEvents.SizeChanged,
      (info: AdMobBannerSize) => {
        this.appMargin = info.height;
        const app: HTMLElement = document.querySelector('ion-router-outlet');

        if (this.appMargin === 0) {
          app.style.marginTop = '';
          return;
        }

        if (this.appMargin > 0) {
          const body = document.querySelector('body');
          const bodyStyles = window.getComputedStyle(body);
          const safeAreaBottom = bodyStyles.getPropertyValue(
            '--ion-safe-area-bottom'
          );

          if (this.bannerPosition === 'top') {
            app.style.marginTop = this.appMargin + 'px';
          } else {
            app.style.marginBottom = `calc(${safeAreaBottom} + ${this.appMargin}px)`;
          }
        }
      }
    );

    const options: BannerAdOptions = {
      adId: environment.admobId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false,
      // npa: true
    };
    AdMob.showBanner(options);
  }

  async prepareShortVideo(): Promise<void> {
    AdMob.addListener(
      InterstitialAdPluginEvents.Loaded,
      (info: AdLoadInfo) => {}
    );

    const options: AdOptions = {
      adId: environment.interestialId,
      isTesting: false,
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
