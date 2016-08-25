import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Car,Insurance,Repair} from '../models/models';
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
    let createCarsTable: string = ' CREATE TABLE IF NOT EXISTS Cars (_id INTEGER PRIMARY KEY AUTOINCREMENT,brand TEXT, model TEXT,plate text,year INTEGER); '
    let createInsurancesTable: string = ' CREATE TABLE IF NOT EXISTS Insurances (_id INTEGER PRIMARY KEY AUTOINCREMENT,plate text,company TEXT, kind TEXT,policy integer, startDate date, endDate date, price integer); '
    let createRepairTable: string = ' CREATE TABLE IF NOT EXISTS Repairs (_id INTEGER PRIMARY KEY AUTOINCREMENT,plate TEXT, kind TEXT,description text, date date, price integer); '

    this.storage.query(createCarsTable);
    this.storage.query(createRepairTable);
    this.storage.query(createInsurancesTable)

    console.log('creando tablas...')
  }

  getCars(): Promise<any> {
    return this.storage.query('select * from Cars')
  }

  getRepairs(plate) {
    return this.storage.query('select * from Repairs where plate=\'' + plate + '\'')
  }

  getInsurances(plate) {
    return this.storage.query('select * from Insurances where plate=\'' + plate + '\'')
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
      for(let repair of car.repairs){
        this.insertRepairToCar(car.plate,repair)
      }
    }


  }

  insertNewCar(car: Car) {
    this.storage.query('insert into Cars(brand, model, plate, year) values("' + car.brand + '", "' + car.model + '","' + car.plate + '","' + car.year + '")').then(() => console.log('Añadido coche'))
  }
  insertInsuranceToCar(plate, insurance: Insurance) {
    this.storage.query('insert into Insurances(plate, company, kind, policy, startDate, endDate, price) values("' + plate + '", "' + insurance.company + '","' + insurance.kind + '","' + insurance.policy + '","' + insurance.startDate + '","'+ insurance.endDate + '",' + insurance.price+')').then(() => console.log('Añadido seguro'));
  }
  insertRepairToCar(plate, repair: Repair) {
    this.storage.query('insert into Repairs(plate, kind, description, date, price) values("' + plate + '", "' + repair.kind + '","' + repair.description + '","' + repair.date + '",' + repair.price + ')').then(() => console.log('Añadida reparacion'));
  }
}