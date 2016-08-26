import {Component} from "@angular/core";
import {ModalController, NavController, ViewController} from 'ionic-angular';
import {InfoPage} from '../infoPage/infoPage'
import {Car} from '../../models/models'
import {CarService} from '../../services/car.service';



@Component({
  templateUrl: 'build/pages/listPage/listPage.html',
  providers: [CarService]
})
export class ListPage {
  cars: Car[] = [];

  constructor(private nav: NavController, private carService: CarService, public modalCtrl: ModalController) {
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
    let modal = this.modalCtrl.create(AddCarModal);
    modal.onDidDismiss(()=> this.refresh())
    modal.present();
  }

  insertMock() {
    this.carService.insertMockData()
  }
}


@Component({
  templateUrl: 'build/pages/listPage/add-car-modal.html',
  providers: [CarService]
})
export class AddCarModal {
  car: any = {};
  constructor(public viewCtrl: ViewController,private carService: CarService) { }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  save(){
    this.carService.insertNewCar(this.car);
    this.dismiss();
  }

}
