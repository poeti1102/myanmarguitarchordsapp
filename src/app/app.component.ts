import { Component } from '@angular/core';
import { AdmobService } from './services/admob/admob.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Songs', url: '/song', icon: 'disc-sharp' },
    { title: 'Authors', url: '/author', icon: 'people' },
    { title: 'Albums', url: '/album', icon: 'book' },
    { title: 'New Songs', url: '/new', icon: 'flame' },
    { title: 'Top Songs', url: '/popular', icon: 'flash' },
  ];
  constructor(private admobServ : AdmobService) {}

  public requestSong() {
    window.open("http://m.me/linaung.82","_system");
  }

  ngOnInit() {
    this.admobServ.initialize();
    this.admobServ.prepareShortVideo();
  }
}
