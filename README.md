# Postman-to-k6

Fork from [postman-to-loadimpact](https://github.com/loadimpact/postman-to-loadimpact)

Converts Postman collections (v2) to Load Impact user scenarios. Given a Postman collection, the transformer will auto-generate a [k6 script](https://docs.k6.io/docs) to be imported as user scenario for your load tests.

The transformer converts Postman requests and [variables](http://blog.getpostman.com/2014/02/20/using-variables-inside-postman-and-collection-runner/) into k6 requests and variables respectively.

Postman [pre-requests](https://www.getpostman.com/docs/pre_request_scripts) and [tests](https://www.getpostman.com/docs/writing_tests) are appended as comments before and after its respective k6 request. The pre-request and test behaviour could easily be replicated with the [Load Impact scripting API](https://docs.k6.io/docs/k6).

## Installation and usage

```bash
git clone git@github.com:borjacampina/postman-to-k6.git
cd postman-to-k6
npm install
bin/postman-to-k6.js examples/postman/v2/echo.json
```