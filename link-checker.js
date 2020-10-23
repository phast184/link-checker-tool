#!/usr/bin/env node

const yargs = require('yargs')


const {handleArgument} = require('./src/argumentHandler/argumentHandlers')

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



//main 
handleArgument(argv);