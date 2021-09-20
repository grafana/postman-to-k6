# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/apideck-libraries/postman-to-k6/compare/v1.8.0...HEAD)

## [1.8.1] - 2020-09-20

### Changed

- Minor enhancement to convert the CLI parameter to camelCased options for easier usage in the CLI options file

## [1.8.0] - 2020-09-18

### Added

- Added the option to generate K6 Request tags for reporting purpose.
- Added option to use a file to pass all CLI options.

## [1.7.0] - 2020-09-01

### Added

- Added option to generate a K6 JSON summary through the handleSummary() callback.

### Changed

- Updated readme
- Migrated the "integration" tests to use Ava snapshots instead of the hardcoded comparison for easier maintenance

## [1.6.1] - 2020-08-18

### Fixed

- Fixes a bug that when using the --skip-pre/--skip-post options was passed, the converter did not remove the pre-request/post-request scripts at the collection or folder level. (grafana#105)

### Changed

- Updated readme to remove the docker hub reference to prevent confusion with the original package, since this fork does not build dockers.

## [1.6.0] - 2020-08-18

### Added

- Extend support for Postman random functions/dynamic variables (grafana#92)
- Exclude disabled headers when converting requests (grafana#103)
- Implement postman replaceIn function
- Extended tests for url encode
- Extended tests for encoding of space characters
- Extended test to include checks for randomPhoneNumber & isoTimestamp

### Security

- Bumped dependencies for ajv, browserify, eslint, lodash, postman-collection, postman-collection-transformer, strip-json-comments, urijs
- Bumped dev dependencies for ava

## [1.5.1] - 2020-08-16

### Fixed

- Bug fix for unwanted conversion of Postman query variables (#106 / #104)

## [1.1.0] - 202-05-22

### Added

- Support for api key authorization.

## [1.0.0] - 2020-05-14

### Added

- Switched code style from standardjs to eslint and prettier
- ci workflows moved to github actions
- Automated deployment of version tags to dockerhub and npm registry

## [0.5.0] - 2020-03-24

### Added

- Support for tags
- Body in aws4 auth calls

### Fixed

- Dependency versions

## [0.4.0] - 2019-11-21

### Added

- Support for file uploads.

### Fixed

- Support empty query string in requests using AWSv4 signature authentication

## [0.3.1] - 2019-10-28

### Fixed

- Polyfill for Object.setPrototypeOf method when a conversion uses any dependency requiring it.

## [0.3.0] - 2019-08-23

### Added

- Support GraphQL variables.

## [0.2.0] - 2019-08-22

### Added

- Dockerfile and installation instructions on how to use Docker image from DockerHub.
- Support for injecting OAuth1 credentials when converting a collection.
- Support for splitting requests into separate JS files for easier rearrangement of logic post-conversion.
- Support for GraphQL body mode.

### Fixed

- Resolution of variables in request bodies.

## [0.1.2] - 2019-03-28

### Fixed

- Support alternate no-body encoding.

## [0.1.1] - 2019-03-26

### Fixed

- Postinstall command.
- Don't ignore scripts folder when packaging npm package.

## [0.1.0] - 2019-03-26

### Added

- Support for prerequest scripts.
- Support for test scripts.
- Support for variables (at all scopes + dynamic).
- Support for data files.
- Support for authentication methods (except Hawk).
- Support for postman.\* interface.
- Support for pm.\* interface.
- Support for global variables exposed by Postman: globals environment data iteration.
- Support for xml2Json conversion.
- Support for file formats v2 and v2.1.

### Updated

- Installation and usage instructions to recommend [nvm](https://github.com/creationix/nvm) to avoid filesystem permission issues when installing the tool globally with `npm install -g ...`

[unreleased]: https://github.com/loadimpact/postman-to-k6/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/loadimpact/postman-to-k6/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.5.0...v1.0.0
[0.5.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/loadimpact/postman-to-k6/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/loadimpact/postman-to-k6/releases/tag/v0.1.0
