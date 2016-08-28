import {Component} from "@angular/core";
import {ModalController, NavController, ViewController, NavParams, Platform, ActionSheetController, AlertController} from 'ionic-angular';
import {InfoPage} from '../infoPage/infoPage'
import {Car} from '../../models/models'
import {CarService} from '../../services/car.service';



@Component({
  templateUrl: 'build/pages/listPage/listPage.html',
  providers: [CarService]
})
export class ListPage {
  cars: Car[] = [];

  constructor(
    private nav: NavController,
    private carService: CarService,
    public modalCtrl: ModalController,
    public actionsheetCtrl: ActionSheetController,
    public platform: Platform,
    public alertCtrl: AlertController) {
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
    modal.onDidDismiss(() => this.refresh())
    modal.present();
  }

  insertMock() {
    this.carService.insertMockData()
  }
  modifyCar(car) {
    let modal = this.modalCtrl.create(AddCarModal, { car: car });
    modal.onDidDismiss(() => this.refresh())
    modal.present();
  }

  showMoreOptions(car) {
    let actionSheet = this.actionsheetCtrl.create({
      title: '¿Que desea hacer?',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Borrar',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
            actionSheet.dismiss();
            let confirm = this.alertCtrl.create({
              title: '¿Esta seguro?',
              message: 'Se procedera a eliminar el vehiculo seleccionado, ¿Esta Seguro?',
              buttons: [
                {
                  text: 'Cancelar',
                  handler: data => {
                    console.log('Disagree clicked');
                  }
                },
                {
                  text: 'Aceptar',
                  handler: data => {
                    this.carService.removeCar(car);
                    confirm.onDidDismiss(() => this.refresh())
                  }
                }
              ]
            });
            confirm.present();
          }
        },
        {
          text: 'Editar',
          icon: !this.platform.is('ios') ? 'brush' : null,
          handler: () => {
            console.log('Edit clicked');
            this.modifyCar(car)

          }
        },
        ,
        {
          text: 'Cancelar',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present()
  }
}


@Component({
  templateUrl: 'build/pages/listPage/add-car-modal.html',
  providers: [CarService]
})
export class AddCarModal {
  car: any;
  editMode: boolean = false;
  title: string = "Añadir nuevo vehiculo";

  constructor(public viewCtrl: ViewController, private carService: CarService, private navParams: NavParams) {
    this.car = this.navParams.get('car')
    if (this.car != undefined) {
      this.editMode = true;
      this.title = "Modifique su vehiculo"
    } else {
      this.car = {};

    }
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  save() {
    if (!this.editMode) {
      this.carService.insertNewCar(this.car);
      this.dismiss();
    } else {
      this.carService.editCar(this.car);
    }
  }

  insertMock() {
    this.carService.insertMockData()
  }

}
