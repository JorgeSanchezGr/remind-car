import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';
import {InfoPage} from '../infoPage/infoPage'
import {Car} from '../../models/models'
import {CarService} from '../../services/car.service';



@Component({
  templateUrl: 'build/pages/listPage/listPage.html',
  providers: [CarService]
})
export class ListPage {
  cars: Car[] = [];

  constructor(private nav: NavController, private carService: CarService) {
    this.refresh()
  }

  onPageWillEnter() {
    this.refresh();
  }

  refresh() {
    this.carService.getCars().then((res) => {

      var cars = [];
      for (var i = 0; i < res.res.rows.length; i++) {
        cars.push(res.res.rows.item(i));
      }
      this.cars = cars;
    })
  }

  moreInfo(car) {
    this.nav.push(InfoPage, { item: car })
  }

  addNewCar() {

  }

  insertMock() {
    this.carService.insertMockData()
  }
}
