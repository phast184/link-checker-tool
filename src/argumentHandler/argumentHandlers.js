

const {checkURL, archivedURL, jsonResult} = require('../urlHelper/urlFunctions')
const {fileInteraction} = require('../readFiles/fileInteractions')

const handleArgument = (argv) => {
    if (argv.u) {
        checkURL(argv.u);
    }
    else if (argv.ar) {
        archivedURL(argv.ar);
    }
    else if (argv.j)
    {
        jsonResult(argv.j) 
    }
    else if (argv.f || argv.all || argv.good || argv.bad || argv.i) {
        
        let fileName = argv.f || argv.a || argv.good || argv.bad;
        fileInteraction(fileName, argv);
        for (i = 0; i < argv._.length; i++) {
            fileInteraction(argv._[i], argv)
        }
    }
}


module.exports = {
    handleArgument
}