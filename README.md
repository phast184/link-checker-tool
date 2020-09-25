# link-checker-tool
This tool is used to check whether an URL is available or not.
##Installation
Clone the source locally:

```sh
$ git clone https://github.com/phast184/link-checker-tool.git
$ cd link-checker-tool
```
Install project dependencies:

```sh
$ npm install
```
Start the app:

```sh
$ npm start
```
## Features

- [x] Offline support
- [x] Check all valid URLs in a file
- [x] Read multiple files at once
- [x] Check if an URL is available

## Usage

###Check all URL in a file 
```sh
$ lct -f foo.js
```

###Check a single URL
```sh
$ lct -fu https://github.com/phast184/link-checker-tool.git
```

###Read multiple files at once
```sh
$ lct -f index2.html test1.txt test.txt
```

##Output



