# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- Support for postman.* interface.
- Support for pm.* interface.
- Support for global variables exposed by Postman: globals environment data iteration.
- Support for xml2Json conversion.
- Support for file formats v2 and v2.1.

### Updated
- Installation and usage instructions to recommend [nvm](https://github.com/creationix/nvm) to avoid filesystem permission issues when installing the tool globally with `npm install -g ...`

[Unreleased]: https://github.com/loadimpact/postman-to-k6/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/loadimpact/postman-to-k6/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/loadimpact/postman-to-k6/releases/tag/v0.1.0
