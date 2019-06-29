/* global postman */

import '../../libs/shim/core.js'

const Request = Symbol.for('request')
postman[Symbol.for('initial')]({
  environment: {
    birch: 'fir',
    pine: 'redwood',
    willow: 'rosewood'
  }
})

export default function () {
  postman[Request]({
    method: 'POST',
    address: 'http://httpbin.org/post',
    data: '{{birch}} {{pine}} {{willow}}',
    post (response) {
      const result = JSON.parse(response.body)
      const data = result.data
      if (data === 'fir redwood rosewood') {
        console.log('Success: body is "fir redwood rosewood"')
      } else {
        throw new Error(
          `Incorrect body (${data}): must be "fir redwood rosewood"`
        )
      }
    }
  })
}
