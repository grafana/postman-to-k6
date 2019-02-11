const aws4  = require('aws4');
const AWS_CREDS = {
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
};

module.exports = {
  enabled: true,
  signedHeaders: function ({service, path}) {
    if (service && path) {
    	const { service, path}
    	return aws4.sign({ service, path }, AWS_CREDS)
    }

  }

};
