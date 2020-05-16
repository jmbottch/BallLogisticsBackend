const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./config/mongoConfig')
const bodyParser = require('body-parser')
const queueConfig = require('./config/rabbitMQConfig')
var amqp = require('amqplib/callback_api')
var http = require('http')

const logisticsController = require('./src/controllers/logisticsCompanyController')
const orderController = require('./src/controllers/orderController')

const logisticsCompanyRoutes = require('./routes/logisticsCompanyRoutes')
const orderRoutes = require('./routes/orderRoutes')

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(express.static(__dirname));

logisticsCompanyRoutes(app)
orderRoutes(app)


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

//RabbitMQ Consumer

amqp.connect('amqp://localhost', (error0, connection) => {
  if(error0) throw error0
  else {
    console.log("Connected to RabbitMQ locally")
    
    for(let i = 0; i < queueConfig.exchangeList.length; i++) {
      const exchange = queueConfig.exchangeList[i]

      connection.createChannel((error1, channel) => {
        if(error1) throw error1
        else {
          channel.assertExchange(exchange, 'fanout', {durable : true})
          
          if(exchange == 'orders-register') {

            var queue = 'orders-register-on-logistics'
            channel.assertQueue(queue, {durable : true})
            channel.bindQueue(queue, exchange, '')

            console.log('@@@@ ---> ' + queue + ' queue is live.')

            channel.consume(queue, (msg) => {
              let payload = JSON.parse(msg.content.toString())
              if(payload) {
                orderController.create(payload)
                channel.ack(msg)
              }else {
                console.log("Something went wrong")
              }
            })
          } else if (exchange == 'orders-edit') {
            var queue = 'orders-edit-on-logistics'
            channel.assertQueue(queue, {durable : true})
            channel.bindQueue(queue, exchange, '')

            console.log('@@@@ ---> ' + queue + ' queue is live.')

            channel.consume(queue, (msg) => {
              let payload = JSON.parse(msg.content.toString())
              if(payload) {
                orderController.changeStatus(payload)
                channel.ack(msg)
              }else {
                console.log("Something went wrong")
              }
            })
          } 
        }
      })
    }
  }
})

// //RabbitMQ Consumer
// amqp.connect('amqp://localhost', (error0, connection) => {
//   if(error0) {throw error0}
//   else {
//     console.log("Connected to RabbitMQ locally")

//     for(let i = 0; i < queueConfig.queueList.length; i++) {
//       const queue = queueConfig.queueList[i]

//       connection.createChannel((error1, channel) => {
//         if(error1) {throw error1}
//         else {
//           channel.assertQueue(queue, {durable: true})

//           channel.consume(queue, (msg) => {
//             let payload = JSON.parse(msg.content.toString())

//             if(queue == 'orders-register') {
//               orderController.create(payload)
//               channel.ack(msg)
//             }
//             if(queue == 'orders-edit') {
//               orderController.changeStatus(payload)
//               channel.ack(msg)
//             }
            
//             // if(queue == 'orders-edit') {
//             //   orderController.edit(payload)
//             //   channel.ack(msg)
//             // }
//             // if(queue == 'orders-remove') {
//             //   orderController.remove(payload)
//             //   channel.ack(msg)
//             // }
//           })
//         }
//       })
//     }
//   }
// })