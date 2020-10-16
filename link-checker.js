#!/usr/bin/env node

const yargs = require('yargs')
const fs = require('fs')
const axios = require('axios');
const chalk = require('chalk');




//syntax with using yargs
const argv = yargs
    .usage('Usage lct <command> [options]')
    .alias('v', 'version')
    .alias('f', 'file')
    .alias('url', 'u')
    .alias('archived', 'ar')
    .alias('g', 'good')
    .alias('b', 'bad')
    .alias('a', 'all')
    .alias('j','json')
    .alias('i', 'ignore')
    .nargs(['f', 'u', 'ar', 'g', 'b', 'a', 'j', 'i'], 1) //set the requirement of at least 1 argument for the option, otherwise display --help menu
    .describe('f', 'Load file(s)')
    .describe('u', 'Check a specific url')
    .describe('ar', 'Check the available archived version of a website')
    .describe('a', "Display the status of all valid urls in a loaded file")
    .describe('good', "Display good urls in a loaded file")
    .describe('bad', "Display bad urls in a loaded file")
    .describe('j', "Display json format output of an URL")
    .describe('i', "Load and parse an ignored URLs text file")
    .example('lct --ar https://www.google.com/', 'Check the archived versions of https://www.google.com/')
    .example('lct -u https://www.google.com/', 'Check the status of https://www.google.com/')
    .example('lct -i ignore-urls.txt -f test.txt', 'Report about all URLS except the URLS mentioned in ignore-urls.txt')
    .help('help')
    .version("NAME: Link checker tool, Version 1.0.0")
    .alias('h', 'help').argv

//INTERACT WITH A FILE
const fileInteraction = (fName) => {
    fs.readFile(fName, (err, data) => {
        if (err) console.log(`${err} \n`);
        else {
            console.log(`${fName} is ready to be open!!!`)
            let text = data.toString();
            let validURLs = getValidURLFormat(text);
            if (validURLs == null)
                console.log(`There is no URLs in ${fName}\n`)
            else {
                if(argv.i){
                   getIgnoredURL(argv.i)
                   .then(data => {
                       //update the validURLs by removing any ignored URLs that found
                        validURLs = validURLs.filter(url => !data.includes(url))
                        return validURLs
                   })
                   .then(updatedValidURLS =>{
                       //call manageURL with updated validURLs
                        manageURL(updatedValidURLS)
                   })
                   .catch(err => {
                       console.log(err);
                   });                    
                }else{
                    //call manageURL with unfiltered validURLs
                    manageURL(validURLs)
                }    

            }
            console.log("---------------------------------------------\n");
        }
    }
    )
}
//call checkURL based on filtered/unfiltered URLs and arguments

const manageURL = (validURLs) =>{
    if (argv.f || argv.all) {
        for (i = 0; i < validURLs.length; i++) {
            checkURL(validURLs[i]);
        }
    }
    else if (argv.good){
        for (i = 0; i < validURLs.length; i++) {
            checkURL(validURLs[i],"good");
        }
    }
    else if (argv.bad){
        for (i = 0; i < validURLs.length; i++) {
            checkURL(validURLs[i],"bad");
        }
    }
}
// check valid URL format

const getValidURLFormat = (text) => {
    let regEx1 = /(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/g
    let validURLs = text.match(regEx1);
    return validURLs;
}

// check status of each URL


const checkURL = async (url, flag = "all") => {
    try {
        const response = await axios.head(url);
        if ((flag == "all") || (flag == "good"))
            console.log(chalk.green("[GOOD]" + "[" + response.status + "]" + " " + url))
    }
    catch (err) {
        if (err.response) {
            if (err.response.status == 404 || err.response.status == 400) {
                if ((flag == "all") || (flag == "bad"))
                    console.log(chalk.red("[BAD]" + "[" + err.response.status + "]" + " " + url))
            }
            else
                if (flag == "all")
                    console.log(chalk.gray("[UNKOWN]" + "[" + err.response.status + "]" + " " + url))
        }
        else {
            if (flag == "all")
                console.log(chalk.gray("[UNKOWN][ENOTFOUND] " + url));
        }
    }
}


//archived version from wayback machine url
const archivedURL = (url) => {
    let bashed_url = encodeURIComponent(url, 26, true);
    axios.get(`http://archive.org/wayback/available?url=${bashed_url}`)
        .then(response => {
            if (response.data.archived_snapshots.length == 0) {
                console.log(`There is no archived version available for ${url}`)
            }
            else {
                console.log((`Check out the archived version at `) + chalk.green.bold(`${response.data.archived_snapshots.closest.url}`))
            }
        })
        .catch(err => console.log(err))
}

//out json result of an url

const jsonResult = async (url) => {

    let result = {
        url: url,
        status: '',
    }
    try{
        const response = await axios.head(url);
        result.status = response.status;
    }
    catch(err)
    {
        if (err.response)
        {
            result.status = err.response.status;
        }
        else{
            result.status = 'unknown';
        }
    }
    console.log(result);
}

//read the ignore file ans retrun all the ignored URLs

const getIgnoredURL = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => {
            if (err) return reject (err);
            else {
                let text = data.toString()
                let ignoredURLs = getValidURLFormat(text);
                if(text.startsWith("#") || ignoredURLs != null){
                    console.log(chalk.green.bold("This is a valid file"))
                    console.log(`${fileName} is ready to be open!!!`)
                    resolve(ignoredURLs)           
                }else{
                    console.log(chalk.red.bold("This is an invalid file."))
                }
            }
        })
    })    
}

//main 

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
        fileInteraction(fileName)
        for (i = 0; i < argv._.length; i++) {
            fileInteraction(argv._[i], argv)
        }
    }
}

handleArgument(argv);