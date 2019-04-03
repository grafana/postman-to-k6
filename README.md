# postman-to-k6 ![CircleCI branch](https://img.shields.io/circleci/project/github/loadimpact/postman-to-k6/master.svg)

Convert a [Postman collection](https://www.getpostman.com/docs/collections) to [k6 script](https://docs.k6.io/docs).

Supported Features:

- Prerequest scripts.
- Test scripts.
- Variables (at all scopes + dynamic).
- Data files.
- Authentication methods (except Hawk).
- `postman.*` interface ([exceptions below](#unsupported-features)).
- `pm.*` interface ([exceptions below](#unsupported-features)).
- Global variables exposed by Postman: `globals` `environment` `data`
  `iteration`.
- `xml2Json` conversion.
- All [Postman Schema](https://schema.getpostman.com/) versions.

## Usage

**Install**:

![npm](https://img.shields.io/npm/v/postman-to-k6.svg) ![npm](https://img.shields.io/npm/dw/postman-to-k6.svg)

Globally, and preferably using [nvm](https://github.com/creationix/nvm) (at least on Unix/Linux systems to avoid filesystem permission issues when using sudo):
```shell
npm install -g postman-to-k6
```

Locally, into `./node_modules`:
```shell
npm install postman-to-k6
```

Note that this will require you to run the converter with `node node_modules/postman-to-k6/bin/postman-to-k6.js ...`.

**Convert**:

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

You can also pass a data file in CSV format.

```shell
postman-to-k6 collection.json --csv data.csv -o k6-script.js
```

Or a data file in JSON format.

```shell
postman-to-k6 collection.json --json data.json -o k6-script.js
```

## Examples

A collection of Postman examples are located under `example`.

    $ postman-to-k6 example/v2/echo.json -o k6-script.js

## Unsupported Features

- Sending requests from scripts: `pm.sendRequest`
- Controlling request execution order: `postman.setNextRequest`
- Cookie properties: `hostOnly` `session` `storeId`
- Textual response message: `responseCode.name` `responseCode.detail`
  `pm.response.reason` `pm.response.to.have.status(reason)`
  `pm.response.to.not.have.status(reason)`
- Properties returning Postman classes: `pm.request.url` `pm.request.headers`
  `pm.response.headers`
- The Hawk authentication method.
- Deprecated `xmlToJson` method.
- Request IDs are changed. Postman doesn't provide them in the export so we
  have to generate new ones.

## Other similar tools

- [jmeter-to-k6](https://github.com/loadimpact/jmeter-to-k6/): Convert
  JMeter JMX files to k6 JS.

## Credits

Thanks to [bookmoons](https://github.com/bookmoons) for creating this tool. Also, thanks to [borjacampina](https://github.com/borjacampina) for creating the original incarnation of the tool.
