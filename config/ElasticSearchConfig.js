const { Client } = require('@elastic/elasticsearch')

const eClient = new Client({ node: 'http://localhost:9200' })

module.exports = eClient