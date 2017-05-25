export class StringUtils {
    static pad(val: string, len: number, token: string): string {
        return val.length < len ? this.pad(token.concat(val), len, token) : val;
    }
}
