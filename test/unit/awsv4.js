import test from 'ava';
import Aws from 'auth/awsv4';

test('Should use service name if available', t => {
  const mockParams = {
    has: s => s === 'service',
    get: () => 'exampleParam',
  };

  const aws = new Aws({ parameters: () => mockParams }, {});
  t.is(aws.getServiceName(mockParams), 'service: "exampleParam"');
});

test('Should default to execute-api if service name is not available', t => {
  const mockParams = {
    has: s => false,
    get: () => 'exampleParam',
  };

  const aws = new Aws({ parameters: () => mockParams }, {});
  t.is(aws.getServiceName(mockParams), 'service: "execute-api"');
});
