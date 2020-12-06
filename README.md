# link-checker-tool

This tool is used to check whether an URL is available or not.

## Features

- [x] Offline support
- [x] Check all valid URLs in a file
- [x] Read multiple files at once
- [x] Check if an URL is available
- [x] Optimize code for header requests
- [x] Check archived versions of a website
- [x] Output json format result
- [x] Only display good/bad urls from a file
- [x] Exclude URLs from our check based on a URL pattern file.

## Usage

### To Install the package

```sh
$ npm -i link-checker-tool
```

or to install globally

```sh
$ npm install -g link-checker-tool
```

### Check all URL in a file

```sh
$ lct -f foo.js
```

### Check a single URL

```sh
$ lct -u https://github.com/phast184/link-checker-tool.git
$ lct --url https://github.com/phast184/link-checker-tool.git

```

### Check archived versions of a website

```sh
$ lct -a https://www.google.com/
$ lct --archived https://www.google.com/

```

### Read multiple files at once

```sh
$ lct -f index2.html test1.txt test.txt
```

### Output only good urls (from multiple files)

```sh
$ lct -g foo.js
$ lct --good foo.js
```

```sh
$ lct -g foo.js foo1.js
$ lct --good foo.js foo1.js
```

### Output only bad urls (from multiple files)

```sh
$ lct -b foo.js
$ lct --bad foo.js
```

```sh
$ lct -b foo.js foo1.js
$ lct --bad foo.js foo1.js
```

### JSON format output

```sh
$ lct -j https://github.com/phast184/link-checker-tool
$ lct --json https://github.com/phast184/link-checker-tool
```

### Ignore URL Patterns

```sh
$ lct -i ingonre-urls.txt -f test.txt
```

Note: `i` option can be used with any other available options : `-f-`,`-g`, `-b`, `-a`

## Output

[![1.jpg](https://i.postimg.cc/L8wZTJND/1.jpg)](https://postimg.cc/Hr0xWkG8)

#### GOOD: the URL is available with the status code of 200

#### BAD: the URL is not available with the status code of 400 or 404

#### UNKNOWN: other status code will be shown as unknown

## License

MIT © [Thanh Tien Phat Nguyen]
