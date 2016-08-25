import {Component, ViewChild} from "@angular/core";
import {Platform, ionicBootstrap, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {ListPage} from './pages/listPage/listPage';
import {CarService} from './services/car.service'

@Component({
  template: '<ion-nav [root]="root"></ion-nav>',
  providers: [CarService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  root = ListPage

  constructor(platform: Platform, private carService: CarService) {
    platform.ready().then(() => {
      this.carService.createTables();

      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);