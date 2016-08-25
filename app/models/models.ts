export interface Car{
    brand: string;
    model: string;
    plate: string;
    year: string;
    repairs?: Repair[];
    insurances?: Insurance[];
}

export interface Insurance{
    company: string;
    price: number;
    kind: string;
    startDate: Date;
    endDate: Date;
    policy: number;

}

export interface Repair{
    kind: string;
    price: number;
    description: string;
    date: Date;
}