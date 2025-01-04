const { Client } = require('@elastic/elasticsearch');
require('dotenv').config(); 

const node = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200'; 

const eClient = new Client({ node });

eClient.ping({}, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!', error);
  } else {
    console.log('Successfully connected to Elasticsearch!');
  }
});

module.exports = eClient;
