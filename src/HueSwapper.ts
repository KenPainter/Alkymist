export class HueSwapper {
    private colorSwaps = {} as {[key:string]:number}
    
    swapHue(h:number) {
        if(!(h in this.colorSwaps)) {
            this.colorSwaps[h] = Math.round( Math.random() * 359 )
        }
        return this.colorSwaps[h]
    }
}