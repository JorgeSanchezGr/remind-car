import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Car, Insurance, Repair} from '../models/models';
import {Storage, SqlStorage} from 'ionic-angular';


@Injectable()
export class CarService {
  storage: Storage;


  constructor() {
    this.storage = new Storage(SqlStorage, { name: 'Data' })
  }
  createTables() {
    if (this.storage == undefined) {
      this.storage = new Storage(SqlStorage, { name: 'Data' })
    }
    let createCarsTable: string = ' CREATE TABLE IF NOT EXISTS Cars (id INTEGER PRIMARY KEY AUTOINCREMENT,brand TEXT, model TEXT,plate text,year INTEGER); '
    let createInsurancesTable: string = ' CREATE TABLE IF NOT EXISTS Insurances (id INTEGER PRIMARY KEY AUTOINCREMENT,plate text,company TEXT, kind TEXT,policy integer, startDate date, endDate date, price integer); '
    let createRepairTable: string = ' CREATE TABLE IF NOT EXISTS Repairs (id INTEGER PRIMARY KEY AUTOINCREMENT,plate TEXT, kind TEXT,description text, date date, price integer); '
    let createITVTable: string = ' CREATE TABLE IF NOT EXISTS ITVs (id INTEGER PRIMARY KEY AUTOINCREMENT,plate TEXT, date TEXT,resolution text, interval integer); '


    this.storage.query(createCarsTable);
    this.storage.query(createRepairTable);
    this.storage.query(createInsurancesTable)
    this.storage.query(createITVTable)
  }

  getITVs() {
    return this.storage.query('select * from ITVs');
  }

  insertITVToCar(plate, itv) {
    this.storage.query('insert into Repairs(plate, resolution, interval, date) values("' + plate + '", "' + itv.kind + '","' + itv.description + '","' + itv.date + ')').then(() => console.log('Añadida ITV'));
  }

  removeITV(plate, itvId) {
    return this.storage.query('DELETE FROM ITVs WHERE plate=\"' + plate + '\" and id=' + itvId + ';')
  }

  editITV(itv, itvID) {
    return this.storage.query('UPDATE ITVs SET interval=' + itv.interval + ', resolution=\"' + itv.resolution + '\", date=\"' + itv.date + '\" WHERE plate=\"' + itv.plate + '\";')
  }

  getCars(): Promise<any> {
    return this.storage.query('select * from Cars')
  }

  removeCar(car) {

    this.storage.query('DELETE FROM Cars WHERE plate=\"' + car.plate + '\";');


    this.getInsurances(car.plate)
      .then((res) => {
        var insurances = [];
        for (var i = 0; i < res.res.rows.length; i++) {
          insurances.push(res.res.rows.item(i));
        }
        car.insurances = insurances;
        console.log('Insurances', car.insurances)

        for (var insurance of car.insurances) {
          this.removeInsurance(car.plate, insurance.id);
        }
      })



    this.getRepairs(car.plate)
      .then((res) => {
        var repairs = [];
        for (var i = 0; i < res.res.rows.length; i++) {
          repairs.push(res.res.rows.item(i));
        }
        car.repairs = repairs;
        console.log('repairs', car.repairs)

        for (var repair of car.repairs) {
          this.removeRepair(car.plate, repair.id)
        }
      })
  }

  editCar(car) {
    return this.storage.query('UPDATE Cars SET brand=\"' + car.brand + '\", model=\"' + car.model + '\", year=' + car.year + ' WHERE plate=\"' + car.plate + '\";')
  }

  getRepairs(plate) {
    return this.storage.query('select * from Repairs where plate=\'' + plate + '\'')
  }

  removeRepair(plate, repairId) {
    return this.storage.query('DELETE FROM Repairs WHERE plate=\"' + plate + '\" and id=' + repairId + ';')
  }

  editRepair(repair, repairId) {
    return this.storage.query('UPDATE Repairs SET kind=\"' + repair.kind + '\", description=\"' + repair.description + '\", price=' + repair.price + ', date=\"' + repair.date + '\" WHERE plate=\"' + repair.plate + '\" and id=' + repairId + ';')
  }

  getInsurances(plate) {
    return this.storage.query('select * from Insurances where plate=\'' + plate + '\'')
  }

  removeInsurance(plate, insuranceId) {
    return this.storage.query('DELETE FROM Insurances WHERE plate=\"' + plate + '\" and id=' + insuranceId + ';')
  }

  insertMockData() {
    let cars: Car[] = [
      {
        brand: 'Renault',
        model: 'Megane',
        plate: '7782FDX',
        year: '2006',
        repairs: [
          {
            kind: 'Ruedas',
            price: 280,
            description: 'Cambio de las 4 ruedas',
            date: new Date(),
          },
          {
            kind: 'Mantenimiento',
            price: 100,
            description: 'Cambio de aceite y liquidos',
            date: new Date()
          }
        ],
        insurances: [
          {
            company: 'AXA',
            price: 678,
            kind: 'Todo Riesgo',
            startDate: new Date(),
            endDate: new Date(),
            policy: 1617328712
          }
        ]
      },
      {
        brand: 'Volkswagen',
        model: 'Golf',
        plate: '4383GYN',
        year: '2010',
        repairs: [
          {
            kind: 'Ruedas',
            price: 280,
            description: 'Cambio de las 4 ruedas',
            date: new Date(),
          },
          {
            kind: 'Mantenimiento',
            price: 100,
            description: 'Cambio de aceite y liquidos',
            date: new Date()
          }
        ],
        insurances: [
          {
            company: 'AXA',
            price: 458,
            kind: 'Todo Riesgo',
            startDate: new Date(),
            endDate: new Date(),
            policy: 1617328712
          }
        ]
      },
      {
        brand: 'Volkswagen',
        model: 'Passat',
        plate: '7683DYG',
        year: '2006',
        repairs: [
          {
            kind: 'Ruedas',
            price: 280,
            description: 'Cambio de las 4 ruedas',
            date: new Date(),
          },
          {
            kind: 'Mantenimiento',
            price: 100,
            description: 'Cambio de aceite y liquidos',
            date: new Date()
          }
        ],
        insurances: [
          {
            company: 'AXA',
            price: 456,
            kind: 'Todo Riesgo',
            startDate: new Date(),
            endDate: new Date(),
            policy: 1617328712
          }
        ]
      }
    ]

    for (let car of cars) {
      this.insertNewCar(car)
      for (let insurance of car.insurances) {
        this.insertInsuranceToCar(car.plate, insurance)
      }
      for (let repair of car.repairs) {
        this.insertRepairToCar(car.plate, repair)
      }
    }


  }

  editInsurance(insurance, insuranceId) {
    return this.storage.query('UPDATE Insurance SET kind=\"' + insurance.kind + '\", policy=\"' + insurance.policy + '\", company=\"' + insurance.company + '\", price=' + insurance.price + ', startDate=\"' + insurance.startDate + '\",endDate=\"' + insurance.endDate + '\" WHERE plate=\"' + insurance.plate + '\" and id=' + insuranceId + ';')
  }

  insertNewCar(car: Car) {
    this.storage.query('insert into Cars(brand, model, plate, year) values("' + car.brand + '", "' + car.model + '","' + car.plate + '","' + car.year + '")').then(() => console.log('Añadido coche'))
  }
  insertInsuranceToCar(plate, insurance: Insurance) {
    this.storage.query('insert into Insurances(plate, company, kind, policy, startDate, endDate, price) values("' + plate + '", "' + insurance.company + '","' + insurance.kind + '","' + insurance.policy + '","' + insurance.startDate + '","' + insurance.endDate + '",' + insurance.price + ')').then(() => console.log('Añadido seguro'));
  }
  insertRepairToCar(plate, repair: Repair) {
    this.storage.query('insert into Repairs(plate, kind, description, date, price) values("' + plate + '", "' + repair.kind + '","' + repair.description + '","' + repair.date + '",' + repair.price + ')').then(() => console.log('Añadida reparacion'));
  }
}