
/**
 * Maps saturation and luminosity to "purity"
 * A pure color has saturation=100, and luminosity = 50
 * 
 * Given a square with origin = sat = lum = 0, the purest
 * color is at the middle of the top edge, where saturation is 100
 * and luminosity is 50.  As the (lum,sat) coordinates move away
 * from that spot at the middle of the top edge, the purity of the
 * color is lost as it is polluted with more white, black, or gray.
 * 
 * A few exapmles:
 *   * For constant lum=50, as saturation decreases, the color is 
 *     more pollutted with gray and less pure
 *   * For constant sat=100, as lum drops away from 50 in either
 *     direction the color is more polluted with black or white.
 *   * For constant sat=0, the color is lost completely and this
 *     function always returns zero 
 *   * In general, purity is the ratio of distance from center
 *     top (lum=50,sat=100) to the distance along the same line
 *     out to an edge.  At all edges purity is zero.
 * 
 * This function takes any two coordinates (lum,sat) and maps
 * the distance towards the closest edge and returns a value
 * from 0 to 1 that denotes the "purity" of the color.  To make
 * the math easier, this routine reflects the high luminosity
 * half onto the low luminosity half, and divides saturation by
 * two so that we have a square.  Then we put the "top dead center"
 * at the origin and measure distance out to top or right edge.
 * 
 *  
 * @param c 
 */
export function colorPurity(c):number {
    const oLum = c.l
    const oSat = c.s

    // generate a new value of luminosity as "x", measuring
    // how far it has dropped away from the center point of 50.
    // x exists on the closed interval 0,50
    let x = c.l <= 50
          ? 50 - c.l
          : 50 - (100 - c.l)

    // Scale down saturation to a scale of 1-50, flip it around
    // so we measure distance from the center point
    let y = (100 - c.s) / 2
    //console.log(` -> (${oLum},${oSat}) => (x,y) of (${x},${y})`)

    // When x=y, they are on the diagonal and we just
    // return either one of them
    if(x === 0) {
        //console.log(' => x is 0, returning (50-y)/50')
        return (50 - y) / 50
    }
    else if(y===0 && x===y) {
        //console.log(' => y is zero or x=y, returning (50-x)/50')
        return (50 - x) / 50
    }
    else {
        // if the point is above diagonal of x=y, reflect down to below diagonal,
        // so we can use the same formula in both cases
        if(y>x) { const x2=y; y=x; x=y}

        // RadiusXY = distance towards right edge of box
        const radiusXY = Math.sqrt( x**2 + y**2 )
        // yPrime = where the vector hits right edge.  Obtained by fact that
        // Tan(angle) = y/x = y-prime / X-max, solved for y-prime
        const yprime = (y * 50) / x
        // By Pythagoras and subsitution, we can solve for length of radius to yprime
        const radiusMax = Math.sqrt( 50**2 + yprime**2 )

        // return the ratio of the radius(x,y) to the radius(x-max,y-prime)
        return 1 - (radiusXY / radiusMax)
    }
}


export const narrow100 = (inp,band) => (inp * band/100) + Math.round(band/2)

export function simplify(c) {
    c.setLum(simplify100(c.l))
    c.setSat(simplify100(c.s))
    c.setHue(simplify360(c.h))
}
export function simplify100(x) {
    return x===100 ? 95 : x - (x % 10) + 5
}

//
// For the color wheel, reduce values 
//
export function simplify360(x) {
    if(x===0) return 0
    if(x===360) return 0
    return x - (x % 9) + 4
}
export function simplify360Increments() {
    let values = {} as {[key:number]: number}
    for(let i=0;i<360;i++) {
        const simplified = simplify360(i)
        if(!(simplified in values)) {
            values[simplified] = Object.keys(values).length
        }
    }
    return Object.keys(values)
}