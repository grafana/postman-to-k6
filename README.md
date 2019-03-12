# postman-to-k6

Convert a [Postman collection](https://www.getpostman.com/docs/collections) to [k6 script](https://docs.k6.io/docs).

Supported Features:

- Variables (at all scopes + dynamic).
- Data files.
- Authentication methods (except Hawk).
- `postman.*` interface.
- `pm.*` interface.
- Global variables exposed by Postman: `globals` `environment` `data`.

Postman [pre-requests](https://www.getpostman.com/docs/pre_request_scripts) and [tests](https://www.getpostman.com/docs/writing_tests) are appended as comments before and after its respective k6 request. The pre-request and test behaviour could easily be replicated with the [k6 API](https://docs.k6.io/docs/k6).

## Usage

Install with npm to get the `postman-to-k6` command.

```shell
npm install -g postman-to-k6
```

Pass a collection export to convert.

```shell
postman-to-k6 collection.json -o k6-script.js
k6 run k6-script.js
```

The default script runs 1 iteration. Increase if desired.

```shell
postman-to-k6 collection.json -i 25 -o k6-script.js
```

Provide environment and global variable exports separately.

```shell
postman-to-k6 collection.json -g globals.json -e environment.json -o k6-script.js
```

You can also pass a data file in CSV format. See
[Advanced Features](#advanced-features) to install dependencies.

```shell
postman-to-k6 collection.json --csv data.csv -o k6-script.js
```

Or a data file in JSON format.

```shell
postman-to-k6 collection.json --json data.json -o k6-script.js
```

## Advanced Features

Some features require browserified versions of certain npm modules. The
browserified file should be in `./{module}.js`. Install `browserify` to get the
command.

```shell
npm install --global browserify
```

AWSv4 authentication requires `aws4 urijs`.

```shell
npm install aws4 urijs
browserify -r aws4 -s aws4 > aws4.js
browserify -r urijs -s URI > urijs.js
```

OAuth 1 authentication requires `oauth-1.0a urijs`.

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

## Examples

A collection of Postman examples are located under `example`.

    $ postman-to-k6 example/v2/echo.json -o k6-script.js

## Credits

Thanks to [borjacampina](https://github.com/borjacampina) for creating this tool.
