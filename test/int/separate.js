import test from 'ava'
import map from 'generate/separate/map'

test('map', t => {
  const tree = {
    items: [
      { name: 'apple' },
      { name: 'apple' },
      { name: 'orange' }
    ],
    locations: [
      {
        name: 'setup',
        items: [{ name: 'login' }],
        locations: []
      },
      {
        name: 'exercise',
        items: [{ name: 'public' }],
        locations: [
          { name: 'public.js', items: [], locations: [] }
        ]
      }
    ]
  }
  const result = map(tree)
  t.deepEqual(result, {
    'apple.js': { name: 'apple' },
    'apple.A.js': { name: 'apple' },
    'orange.js': { name: 'orange' },
    setup: {
      'login.js': { name: 'login' }
    },
    exercise: {
      'public.js': { name: 'public' },
      'public.js.A': {}
    }
  })
})
