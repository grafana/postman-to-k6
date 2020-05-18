import test from 'ava';
import collection from 'helper/collection';
import aggregate from 'generate/separate/aggregate';

test('success', t => {
  const node = collection('test/material/2.1/tree.json');
  const result = aggregate(node);
  t.is(typeof result, 'object');
  t.is(result.items.length, 1);
  t.is(result.locations.length, 4);
  t.is(result.locations[0].items.length, 0);
  t.is(result.locations[0].locations.length, 2);
  t.is(result.locations[0].locations[0].items.length, 1);
  t.is(result.locations[0].locations[0].locations.length, 0);
  t.is(result.locations[0].locations[1].items.length, 2);
  t.is(result.locations[0].locations[1].locations.length, 0);
  t.is(result.locations[1].items.length, 1);
  t.is(result.locations[1].locations.length, 0);
  t.is(result.locations[2].items.length, 3);
  t.is(result.locations[2].locations.length, 0);
  t.is(result.locations[3].items.length, 3);
  t.is(result.locations[3].locations.length, 0);
});
