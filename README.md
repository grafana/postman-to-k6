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

Some features require browserified versions of certain npm modules. The
browserified file should be in `./{module-name}.js`. Install browserify
globally to get the `browserify` command.

```shell
npm install --global browserify
```

AWSv4 authentication requires `aws4 urijs`.

```shell
npm install aws4 urijs
browserify -r aws4 -s aws4 > aws4.js
browserify -r urijs -s URI > urijs.js
```

OAuth 1 authentication requires `oath-1.0a urijs`.

```shell
npm install oauth-1.0a urijs
browserify -r oauth-1.0a -s OAuth > oauth-1.0a.js
browserify -r urijs -s URI > urijs.js
```

OAuth 2 authentication requires `urijs`.

```shell
npm install urijs
browserify -r urijs -s URI > urijs.js
```

A CSV data file requires `papaparse`.

```shell
npm install papaparse
browserify -r papaparse -s papaparse > papaparse.js
```

## Options

The transformer provides a command line interface with different options.

      Usage: postman-to-k6 <path> [options]
    
      Convert a Postman collection to k6 script
    
      Options:
    
        -h, --help                    Print usage information.
        -V, --version                 Print program version.
        -o --output <path>            Output file path. Default stdout.
        -g --global <path>            JSON export of global variables.
        -e --environment <path>       JSON export of environment.
        -c --csv <path>               CSV data file. Used to fill data variables.
        -j --json <path>              JSON data file. Used to fill data variables.

## Examples

A collection of Postman examples are located under `example`.

    $ postman-to-k6 example/v2/echo.json -o k6-script.js

Please use the [issue tracker](https://github.com/loadimpact/postman-to-k6/issues) to open a discussion or bug report.

## Credits

Thanks to [borjacampina](https://github.com/borjacampina) for creating this tool.
