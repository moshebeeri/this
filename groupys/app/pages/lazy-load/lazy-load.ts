import { Page } from 'ionic-angular';
import { LazyLoadImageDirective } from 'ng2-lazyload-image';

@Page({
  templateUrl: 'build/pages/lazy-load/lazy-load.html',
  directives: [ LazyLoadImageDirective ]
})
export class LazyLoadPage {
  defaultImage: string;
  image: string;
  offset: number;

  constructor() {
    this.defaultImage = 'https://www.placecage.com/1000/1000';
    this.image = 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg';
    this.offset = 100;
  }
}
