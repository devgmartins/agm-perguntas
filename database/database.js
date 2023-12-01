const Sequelize = require('sequelize')

const connection = new Sequelize('agmperguntas','root','54117154826a',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection