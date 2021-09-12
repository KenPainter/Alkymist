/**
 * A transform converts exactly one pixel into something else.
 * It expects as input a color object created by the colz library
 *   let c = new colz.Color(r,g,b)
 * 
 * The transform mutates the input object and has no return value
 * 
 * Utility functions are generally located near the transforms that use them 
 */
import { HueSwapper} from './HueSwapper'
import { narrow100,colorPurity,simplify,simplify360,simplify100 } from './mappers'


export interface Transform {
    name: string
    comment: string
    function: Function
}

export const transforms:Array<Transform>  = []

// non-simplified views of a single dimension: value, hue, saturation
transforms.push({
    name: 'FA-1-Only-Values',
    comment: "A black and white image.  Done by setting saturation to zero",
    function: c=>c.setSat(0)
})
transforms.push({
    name: 'FA-2-Only-Hues',
    comment: "By pushing saturation to 100 and luminosity to 50, we get the 'pure' hues with"
            +" no black or white, as we would get if we mixed ideal pigments w/o black or white",
    function: c=>{ c.setLum(50), c.setSat(100)}
})
// Mapping saturation is tricky
transforms.push({
    name: 'FA-3-Only-Saturation',
    comment: "Lighter areas are where the hue is purest, with the least black or white.  "
            +"  Darker areas have more black (or white!) mixed in.  So both pure whites and "
            +"  pure darks on the input appear black on the output.",
    function: c=>{
        c.setLum( 100 - (colorPurity(c) * 50))
        c.setSat(100)
    }
})

// Direct images to paint from
transforms.push({
    name: 'PF-PaintFrom-0-Blocking',
    comment: 'Use this as the blocking starting point for an Alla Prima',
    function: c=>simplify(c)
})

transforms.push({
   name: 'PF-PaintFrom-1-Grisaille',
   comment: 'Use this as the blocking starting point for a Grisaille',
   function: c=> {
       c.setSat(0)
       c.setLum( simplify100(c.l) )
       c.setHue( simplify360(c.h) )
   }
})

// Grisaille band function
let gBand = (c,keep)=>{ if(simplify100(c.l)!=keep) { c.r = 175; c.g=215; c.b=175 }}
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-05',comment:"",function: c=>gBand(c,5)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-15',comment:"",function: c=>gBand(c,15)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-25',comment:"",function: c=>gBand(c,25)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-35',comment:"",function: c=>gBand(c,35)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-45',comment:"",function: c=>gBand(c,45)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-55',comment:"",function: c=>gBand(c,55)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-65',comment:"",function: c=>gBand(c,65)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-75',comment:"",function: c=>gBand(c,75)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-85',comment:"",function: c=>gBand(c,85)})
transforms.push({ name: 'PF-PaintFrom-1-Grisaille-Band-95',comment:"",function: c=>gBand(c,95)})

// Fun Stuff
// Swapped colors to illustrate importance of values
const hueSwapper = new HueSwapper()
transforms.push({
    name: "XFUN-1-HueRandom",
    comment: "Demonstrates how important values are by randomzing hues",
    function: c=>c.setHue( hueSwapper.swapHue(c.h))
})
transforms.push({
    name: "XFUN-2-HueComplementary",
    comment: "Demonstrates how important values are by swapping all hues with their complement",
    function: c=>{
        let newHue = c.h + 180
        newHue-= c.h < 360 ?  0 : 360
        c.setHue(newHue)
    }
})
transforms.push({
    name: "XFUN-3-Vivid-Blocked",
    comment: "More vivid version suitable for a blocking starting point",
    function: c=>{
        // Push up saturation
        c.setSat( (simplify100(c.s) * 0.6) + 40 )
        // Flatten luminosity
        c.setLum( (simplify100(c.l) * 0.6) + 20 )
    }
})