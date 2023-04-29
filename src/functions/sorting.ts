export function sortHigh(a: any, b:any) {
    if (new Date(a[1]) === new Date(b[1])) {
        return 0;
    }
    else {
        return (new Date(a[1]) > new Date(b[1])) ? -1 : 1;
    }
}
  
export function sortLow(a: any, b:any) {
    if (new Date(a[1]) === new Date(b[1])) {
        return 0;
    }
    else {
        return (new Date(a[1]) < new Date(b[1])) ? -1 : 1;
    }
}