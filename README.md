# postman-to-k6

Converts a [Postman collections](https://www.getpostman.com/docs/collections) to [k6 script](https://docs.k6.io/docs).

The transformer converts Postman requests and [variables](http://blog.getpostman.com/2014/02/20/using-variables-inside-postman-and-collection-runner/) into k6 requests and variables respectively.

Postman [pre-requests](https://www.getpostman.com/docs/pre_request_scripts) and [tests](https://www.getpostman.com/docs/writing_tests) are appended as comments before and after its respective k6 request. The pre-request and test behaviour could easily be replicated with the [k6 API](https://docs.k6.io/docs/k6).

## Usage

As npm global package:

```bash
npm install -g postman-to-k6
postman-to-k6 postman-collection.json -o k6-script.js
k6 run k6-script.js
```

As local repository:

```bash
git clone git@github.com:loadimpact/postman-to-k6.git
cd postman-to-k6
npm install

# On macOS, Linux, or OpenBSD
bin/postman-to-k6.js example/v2/echo.json -o k6-script.js

# On windows
node bin/postman-to-loadimpact.js example/v2/echo.json

k6 run k6-script.js
```

## Advanced Features

AWSv4 authentication requires browserified versions of the modules `aws4` and
`urijs` in the files `./aws4.js` and `./urijs.js`, respectively.

```shell
npm install --global browserify
npm install aws4 urijs
browserify -r aws4 -s aws4 > aws4.js
browserify -r urijs -s URI > urijs.js
```

## Options

The transformer provides a command line interface with different options.

      Usage: postman-to-k6 <filePath> [options]
    
      Convert a Postman collection to k6 script
    
      Options:
    
        -h, --help                    output usage information
        -V, --version                 output the version number
        -j --input-version <version>  Input version. Options `2.0.0` or `1.0.0`. Default `2.0.0`.
        -o --output <path>            Output file path. If not specified writes to stdout.

## Examples

A collection of Postman examples are located under `example/`.

The k6 script will be auto-generated when running:

    $ postman-to-k6 example/v2/echo.json - o k6-script.js

Please use the [issue tracker](https://github.com/loadimpact/postman-to-k6/issues) to open a discussion or bug report.

## Credits

Thanks to [borjacampina](https://github.com/borjacampina) for creating this tool.
