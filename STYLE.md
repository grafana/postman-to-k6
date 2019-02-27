# Style

Code style is [StandardJS](https://standardjs.com). `npm run lint` validates.

Conditionals and loops always use an indented explicit block.

```js
if (options.verbose) {
  console.log('Processing list')
}

while (list.length) {
  process(list.pop())
}
```

Switch cases are always multiline.

```js
switch (variable.type) {
  case 'boolean':
    return VariableType.Boolean
  case 'json':
    return VariableType.Json
  case 'number':
    return VariableType.Number
  case 'string':
    return VariableType.String
}
```
