import { Parameters } from './parameters'
import { ImageSet } from './imageSet'

export default async function main(parameters:Parameters) {
    console.log(">> Loading Image")
    console.log(parameters)
    let imageSet = new ImageSet()
    await imageSet.init(parameters)
    console.log(`   Image is ${imageSet.WIDTH} wide x ${imageSet.HEIGHT} high for pixel count of ${imageSet.PIXEL_COUNT}`)

    /*
    console.log(">> Pass 1 to gather statistics")
    imageSet.compileHueStats()

    //let palettes = new Palettes()
    //palettes.writeHues(process.argv[2],imageSet.statsHueSorted)

    console.log(">> Registering fixed transformations")
    transforms.forEach(transform=>{
        imageSet.initOutput( transform.name, transform.function)
    })


    console.log(">> Registering transformations for most-used hues")
    const flatten = c => { c.setLum( Math.round(c.l * .3) + 35); c.setSat( 0 )}
    const hueRange = (c,lt,gt) => { 
        if(c.h <= lt || c.h >= gt) { 
            flatten(c) 
        } 
        else {
            c.setLum( 100 - Math.round(50 * colorPurity(c)))
            c.setSat(100)
        }
    }
    for(let i=0; i<Math.min(20,imageSet.statsHueSorted.length); i++) {
        let h = imageSet.statsHueSorted[i].hue
        let name = `000${i}`.slice(-2)
        imageSet.initOutput( `HueRange-${name}-${h}`, c=>hueRange(c,h-4,h+4), h )
    }

    console.log(">> Pass 2 to process output images")
    imageSet.process()
    imageSet.postProcess()

    console.log(">> Writing output")
    imageSet.writeFiles()
    */
}

