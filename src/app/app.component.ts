import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Songs', url: '/song', icon: 'disc' },
    { title: 'Authors', url: '/author', icon: 'people' },
    { title: 'Albums', url: '/album', icon: 'book' },
    { title: 'New Songs', url: '/new', icon: 'flame' },
    { title: 'Top Songs', url: '/popular', icon: 'flash' },
  ];
  constructor() {}
}
