const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./config/mongoConfig')
const bodyParser = require('body-parser')
// const queueConfig = require('./config/rabbitmq_queues')
var amqp = require('amqplib/callback_api')
var http = require('http')

const logisticsController = require('./src/controllers/logisticsCompanyController')

const logisticsCompanyRoutes = require('./routes/logisticsCompanyRoutes')

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(express.static(__dirname));

logisticsCompanyRoutes(app)


mongoose.connect(config.dburl_env, { useNewUrlParser: true });
var connection = mongoose.connection
  .once('open', () => console.log('Connected to Mongo on ' + config.dburl_env))
  .on('error', (error) => {
    console.warn('Warning', error.toString());
  });



//set up server
const port = process.env.PORT || '3006';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('Running on port:' + port));