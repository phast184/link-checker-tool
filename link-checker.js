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
    .alias('archived', 'a')
    .alias('j', 'json')
    .nargs(['f', 'u', 'a', 'j'], 1) //set the requirement of at least 1 argument for the option, otherwise display --help menu
    .describe('f', 'Load file(s)')
    .describe('u', 'Check a specific url')
    .describe('a', 'Check the available archived version of a website')
    .describe('j', 'Output json result of an URL')
    .example('lct -a https://www.google.com/', 'Check the archived versions of https://www.google.com/')
    .example('lct -u https://www.google.com/', 'Check the status of https://www.google.com/')
    .help('help')
    .version("NAME: Link checker tool, Version 1.0.0")
    .alias('h', 'help').argv

//INTERACT WITH A FILE
const fileInteraction = (fName, agrv) => {
    fs.readFile(fName, (err, data) => {
        if (err) console.log(`${err} \n`);
        else {
            console.log(`${fName} is ready to be open!!!`)
            let text = data.toString();
            let validURLs = getValidURLFormat(text);
            if (validURLs == null)
                console.log(`There is no URLs in ${fName}\n`)
            else {
                for (i = 0; i < validURLs.length; i++) {
                    checkURL(validURLs[i]);
                }
            }
            console.log("---------------------------------------------\n");
        }
    }
    )
}

// check valid URL format

const getValidURLFormat = (text) => {
    let regEx1 = /(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z\#\+\%@\.\/_-]+))?(\?[0-9a-zA-Z\+\%@\/&\[\];=_-]+)?)?))\b/g
    let validURLs = text.match(regEx1);
    return validURLs;
}

// check status of each URL


const checkURL = async (url) => {
    try {
        const response = await axios.head(url);
        console.log(chalk.green("[GOOD]" + "[" + response.status + "]" + " " + url))
    }
    catch (err) {
        if (err.response) {
            if (err.response.status == 404 || err.response.status == 400)
                console.log(chalk.red("[BAD]" + "[" + err.response.status + "]" + " " + url))
            else
                console.log(chalk.gray("[UNKOWN]" + "[" + err.response.status + "]" + " " + url))
        }
        else
            console.log(chalk.gray("[UNKOWN][ENOTFOUND] " + url));
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
//main 

const handleArgument = (argv) => {
    if (argv.u) {
        checkURL(argv.u);
    }
    else if (argv.f) {

        console.log(fileInteraction(argv.f))
        for (i = 0; i < argv._.length; i++) {
            fileInteraction(argv._[i])

        }
    }
    else if (argv.a) {
        archivedURL(argv.a);
    }
    else if (argv.j)
    {
        jsonResult(argv.j)   
    }
}


handleArgument(argv);