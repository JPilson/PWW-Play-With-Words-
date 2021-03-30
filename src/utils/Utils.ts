
import moment from "moment";
import NumberFormatOptions = Intl.NumberFormatOptions;
moment.locale('pt-br');

export enum dateFormats {
    MMDDYYYY,
    DDMMYYYYhhmmss,
    MMMYYYYDD,
    MMM
}

export enum month {
    jan,
    feb,
    mar,
    apr,
    may,
    jun,
    jul,
    oug,
    sep,
    oct,
    nov,
    dez
}

export default class Utils {
 public static dateFormats = [
     "MM-DD-YYYY",
     "DD-MM-YYYY",
     "MMM YYYY,DD",
     "MMMM"
 ];
    constructor() {

    }


    public static formatDate(date:Date|string|number,format:dateFormats):string{
        const dateX = new Date(date)
        return moment(dateX).format(Utils.dateFormats[format]);
    }

    static getRandomInt(max:number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static currency(valor:string|number,currency: string | null='AOA',showCurrency=true):string {
        const locale = "de-DE" //de-DE
        const  value: number = (typeof valor === "string")?parseFloat(valor):valor
        const options:NumberFormatOptions = showCurrency?{
            style: 'currency',
            currency: currency?.toString(),
        } : {}

        return new Intl.NumberFormat(locale, options).format(value)

    }

     static tel(number:string){
        try {
            let phone;
            if (number.includes("+244"))
                phone = number;
            else
                phone = "+244" + number.trim();

            window.open(`tel:${phone}`);
        } catch (e) {
            const erro =  new Error();
            erro.name = "Nao foi Possível ligar"
            erro.stack = e.stack;
            throw erro;
        }
    }



}