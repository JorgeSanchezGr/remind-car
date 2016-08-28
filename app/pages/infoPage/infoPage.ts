import {Component} from "@angular/core";
import {ViewController, NavController, NavParams, ActionSheetController, Platform} from 'ionic-angular';
import {Car, Insurance, Repair} from '../../models/models';
import {CarService} from '../../services/car.service';
import {AddCarModal} from '../listPage/listPage';
import { ModalController } from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/infoPage/infoPage.html',
  providers: [CarService]
})
export class InfoPage {
  car: Car;
  constructor(private nav: NavController,
    public platform: Platform,
    private navParams: NavParams,
    private carService: CarService,
    public modalCtrl: ModalController,
    public actionSheetCtrl: ActionSheetController) {
    this.car = this.navParams.get('item');

    this.refresh();
  }

  refresh() {
    this.carService.getInsurances(this.car.plate)
      .then((res) => {
        var insurances = [];
        for (var i = 0; i < res.res.rows.length; i++) {
          insurances.push(res.res.rows.item(i));
        }
        this.car.insurances = insurances;
      })

    this.carService.getRepairs(this.car.plate)
      .then((res) => {
        var repairs = [];
        for (var i = 0; i < res.res.rows.length; i++) {
          repairs.push(res.res.rows.item(i));
        }
        this.car.repairs = repairs;
      })
  }

  showOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '¿Que desea añadir?',
      buttons: [
        {
          text: 'Reparación',
          role: 'repair',
          handler: () => {
            this.openModal(AddRepairModal)
          }
        },
        {
          text: 'Poliza de Seguro',
          role: 'insurance',
          handler: () => {
            this.openModal(AddInsuranceModal)
          }
        },
        {
          text: 'ITV',
          role: 'itv',
          handler: () => {
            this.openModal(AddInsuranceModal)
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
    actionSheet.present();
  }

  openModal(page) {
    let modal = this.modalCtrl.create(page, { plate: this.car.plate });
    modal.onDidDismiss(() => this.refresh())
    modal.present();
  }


}

@Component({
  templateUrl: 'build/pages/infoPage/add-insurance-modal.html',
  providers: [CarService]
})
export class AddInsuranceModal {
  plate: string;
  insurance: any = {};
  constructor(public viewCtrl: ViewController, private carService: CarService, private navParams: NavParams) {
    this.plate = this.navParams.get('plate')
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  save() {
    this.carService.insertInsuranceToCar(this.plate, this.insurance)
    this.dismiss();
  }

}

@Component({
  templateUrl: 'build/pages/infoPage/add-repair-modal.html',
  providers: [CarService]
})
export class AddRepairModal {
  plate: string;
  repair: any = {}
  constructor(public viewCtrl: ViewController, private carService: CarService, private navParams: NavParams) {
    this.plate = this.navParams.get('plate')
  }
  dismiss() {
    this.viewCtrl.dismiss()
  }
  save() {
    this.carService.insertRepairToCar(this.plate, this.repair);
    this.dismiss();
  }

}

@Component({
  templateUrl: 'build/pages/listPage/add-itv-modal.html',
  providers: [CarService]
})
export class AddITVModal {
  itv: any;
  editMode: boolean = false;
  title: string = "Añadir nueva ITV";

  constructor(public viewCtrl: ViewController, private carService: CarService, private navParams: NavParams) {
    this.itv = this.navParams.get('itv')
    if (this.itv != undefined) {
      this.editMode = true;
      this.title = "Modifique ITV"
    } else {
      this.itv = {};

    }
  }

  dismiss() {
    this.viewCtrl.dismiss()
  }

  save() {
    if (!this.editMode) {
      this.carService.insertITVToCar(this.itv.plate, this.itv)
      this.dismiss();
    } else {
      this.carService.editITV(this.itv.plate, this.itv.id)
    }
  }


}
