# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2019-03-26
### Fixed
- Postinstall command.

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

[Unreleased]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/loadimpact/postman-to-k6/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/loadimpact/postman-to-k6/releases/tag/v0.1.0
