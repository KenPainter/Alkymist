import Jimp from 'jimp'
import * as colz from 'colz'
import { HueDetails } from './HueDetails'
import { simplify100, simplify360 } from './mappers'
import { Parameters } from './parameters'

export interface Image {
    image: Jimp
    fileSpec: string
    transform: Function
    hue?: number
}
export class ImageSet {
    inpFileSpec:string
    imgInput: Jimp
    WIDTH:number
    HEIGHT:number
    PIXEL_COUNT: number
    INDEX_COUNT: number
    parameters: Parameters

    images:Array<Image> = []
    
    statsHueOnly = {} as{[key:number]: HueDetails } 
    statsHueDetail = {} as {[key:string]: HueDetails }
    statsHueSorted:Array<HueDetails> = []

    async init(parameters:Parameters) {
        this.parameters = this.parameters
        this.inpFileSpec = parameters.image
        this.imgInput = await Jimp.read(this.inpFileSpec) 
        this.WIDTH = this.imgInput.getWidth()
        this.HEIGHT = this.imgInput.getHeight()
        this.PIXEL_COUNT = this.WIDTH * this.HEIGHT
        this.INDEX_COUNT = this.PIXEL_COUNT * 4
    }

    initOutput(fileSuffix:string,transform:Function,hue?:number) {
        let image = new Jimp(this.WIDTH,this.HEIGHT) 
        let fileSpec = `${this.inpFileSpec}.${fileSuffix}.png`
        this.images.push({image,fileSpec,transform,hue})
    }

    getColor(idx:number):any {
        const r = this.imgInput.bitmap.data[idx]
        const g = this.imgInput.bitmap.data[idx+1]
        const b = this.imgInput.bitmap.data[idx+2]
        return new colz.Color(r,g,b)
    }

    compileHueStats() {
        for(let i=0; i<this.INDEX_COUNT; i+=4) {
            const c = this.getColor(i)
            c.setHue( simplify360( c.h ))
            c.setLum( simplify100( c.l ))
            c.setSat( simplify100( c.s ))
            if(!(c.h in this.statsHueOnly)) {
                this.statsHueOnly[c.h] = { hue: c.h, pixels: 0, r: c.r, g: c.g, b: c.b }
            }
            this.statsHueOnly[c.h].pixels++
            const key = `${c.h}.${c.l}.${c.s}`
            if(!(key in this.statsHueDetail)) {
                this.statsHueDetail[key] = { hue: c.h, pixels: 0, r: c.r, g: c.g, b: c.b }
            }
            this.statsHueDetail[key].pixels++
            this.statsHueSorted = Object.values(this.statsHueOnly).sort((a,b)=>a.pixels > b.pixels ? -1 : 1)
        }
    }

    // Main loop through pixels
    process() {
        console.log(">> Image processing is now starting")
        const FIVE_PERCENT = Math.floor(this.INDEX_COUNT / 20)  
        for(let i=0; i<this.INDEX_COUNT; i+=4) {
            if( i % FIVE_PERCENT === 0) {
                console.log("  -> Percent Complete: ",Math.round((i/this.INDEX_COUNT)*100))
            }
            this.transformPixel(i)

        }
    }

    postProcess() {
        console.log(">> Image post-processing is now starting")
        this.images.filter(i=>i.hue != null).forEach(i=>{
            console.log("Adding swatch to ",i.fileSpec)
            let c = new colz.Color(0,0,0)
            c.setHue(i.hue)
            c.setLum(50)
            c.setSat(100)
            for(let x=50;x<=150;x++) {
                for(let y=50;y<=150;y++) {
                    let index = ((y * i.image.getWidth()) + x) * 4
                    i.image.bitmap.data[index]   = c.r
                    i.image.bitmap.data[index+1] = c.g
                    i.image.bitmap.data[index+2] = c.b
                }
             }
        })
    }

    transformPixel(idx) {
        for(let imgIdx=0; imgIdx<this.images.length; imgIdx++) {
            // It might seem faster to make this object once and keep re-using
            // it by resetting its values.  But tests (see ./experiment/colz-speed)
            // show it is faster to make a new object
            let c = this.getColor(idx)
            let imgOut = this.images[imgIdx]
            imgOut.transform(c) 
            imgOut.image.bitmap.data[idx]   = c.r
            imgOut.image.bitmap.data[idx+1] = c.g
            imgOut.image.bitmap.data[idx+2] = c.b
            imgOut.image.bitmap.data[idx+3] = 255
        }
    }

    writeFiles() {
        this.images.forEach(i=>{
            console.log(" -> Writing file ",i.fileSpec)
            i.image.write(i.fileSpec)
        })
    }
}