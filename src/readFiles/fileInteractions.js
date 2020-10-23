const fs = require('fs')
const chalk = require('chalk')

const {getValidURLFormat, manageURL} = require('../urlHelper/urlFunctions')

//INTERACT WITH A FILE
const fileInteraction = (fName, argv) => {
    fs.readFile(fName, (err, data) => {
        if (err) console.log(`${err} \n`);
        else {
            consoleMsg(fName)
            let text = data.toString();
            let validURLs = getValidURLFormat(text);
            if (!validURLs)
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
                        manageURL(updatedValidURLS, argv)
                   })
                   .catch(err => {
                       console.log(err);
                   });                    
                }else{
                    //call manageURL with unfiltered validURLs
                    manageURL(validURLs, argv)
                }    

            }
        }
    }
    )
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
                    consoleMsg(fileName)
                    resolve(ignoredURLs)           
                }else{
                    consoleMsg(fileName,false);
                }
            }
        })
    })    
}

const consoleMsg = (fileName, flag = true) => {
    if (flag)
    {
        console.log(chalk.green.bold("This is a valid file"))
        console.log(`${fileName} is ready to be open!!!`)
        console.log("---------------------------------------------\n");
    }
    else{
        console.log(chalk.red.bold("This is an invalid file."))
    }
}

module.exports = {
    fileInteraction,
    getIgnoredURL
}