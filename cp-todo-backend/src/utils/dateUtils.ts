import * as moment from "moment";
import {StringUtils} from "./stringUtils";

export class DateUtils {
    // Fuck flexibility, we only support DD-MM-YYYY format

    public static DDMMYYYY_ISO = 'DD-MM-YYYY';

    static ddMMyyyy(separator: string): string {
        let date = new Date();
        return this.formatDate(date, separator);
    }

    static formatDate(date: Date, separator: string): string {
        return StringUtils.pad(date.getDate().toString(), 2, '0') + separator
            + StringUtils.pad((date.getMonth() + 1).toString(), 2, '0') + separator + date.getFullYear();
    }

    static isDateOfDDmmYYYY(date: string): boolean {
        let parsed = moment.utc(date, this.DDMMYYYY_ISO);
        return parsed.isValid();
    }

    static formatDateStr(date: string, format: string): string {
        let parsed = moment.utc(date, format);
        return this.formatDate(parsed.toDate(), '-');
    }
}
