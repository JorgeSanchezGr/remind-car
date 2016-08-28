export interface Car{
    id?: any;
    brand: string;
    model: string;
    plate: string;
    year: string;
    repairs?: Repair[];
    insurances?: Insurance[];
    itvs?: ITV[];
}

export interface Insurance{
    id?: any;
    company: string;
    price: number;
    kind: string;
    startDate: Date;
    endDate: Date;
    policy: number;
    plate?: string;

}

export interface Repair{
    id?: any;
    kind: string;
    price: number;
    description: string;
    date: Date;
    plate?: string;
}

export interface ITV{
    id?: any;
    date: Date;
    interval: number;
    resolution: string;
    plate?: string;
}