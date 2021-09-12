import * as yargs from 'yargs'
import { Parameters, parameterDefaults } from './src/parameters'
import main from './src/main'

let parameters:Parameters = { ...parameterDefaults }

const argv = yargs.argv
// yargs docs say use "hideBin" but it does not work
const paramNames = Object.keys(argv).filter(pn=> pn!='$0' && pn!="_")
const paramNamesBad = paramNames.filter(parmName=>!Object.keys(parameterDefaults).includes(parmName))

// Exit on bad parameters
paramNamesBad.forEach(pn=>console.log("Unknown command-line parameter: ",pn))
if(paramNamesBad.length > 0) {
    process.exit()
}

paramNames.forEach(paramName=>{
    if(argv[paramName] !== undefined) {
        parameters[paramName] = argv[paramName]
    }
})

main(parameters)
