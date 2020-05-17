const Order = require('../models/order')
const amqp = require('amqplib/callback_api')
const rabbitconfig = require('../../config/rabbitMQConfig')

module.exports = {

    getAll(req, res) {
        Order.find()
            .then((orders) => {
                res.status(200).send(orders)
            })
            .catch((err) => {
                res.status(404).send({ Error: "Orders not found" })
            })
    },

    getOne(req, res) {
        Order.findOne({ _id: req.body._id })
            .then((order) => {
                res.status(200).send(order)
            })
            .catch((err) => {
                res.status(404).send({ Error: "Order not found" })
            })
    },

    create(payload) {
        Order.create({
            _id : payload._id,
            orderNr: payload.orderNr,
            status: payload.status,
            orderSize: payload.products.length,
            shippingAddress: payload.shippingAddress
        }).then(() => {
            console.log("@@@@ ---> Order created")
        })
            .catch(() => {
                console.log("@@@@ ---> Error")
            })
    },

    delete(payload) {
        Order.findOne({_id : payload._id})
        .then((order) => {
            order.remove()
            console.log("Order has been removed")
        })
        .catch(() => {
            console.log("Something went wrong")
        })
    },

    changeStatus(payload) {
        Order.findOne({_id : payload._id})
        .then((order) => {
            order.set({
                status : payload.status
            })
            order.save()
            .then(() => {
                console.log("@@@@ ---> Orderstatus set to " + payload.status)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log("@@@@ ---> 404 Order not found")
        })
    },

    setReceived(req, res) {
        try {
            amqp.connect(rabbitconfig.rabbit_connect, (error0, connection) => {
            if(error0) throw error0
            else {
                connection.createChannel((error1, channel) => {
                    if(error1) throw error1
                    else {
                        var exchange = 'orders-edit-status'

                        var message = {
                            _id : req.body._id,
                            status : "RECEIVED AT SORTING CENTRE"
                        }

                        var payload = JSON.stringify(message)

                        channel.assertExchange(exchange, 'fanout', {durable:true})
                        channel.publish(exchange, '', Buffer.from(payload), {noAck : false})

                        console.log("Message sent")
                        res.status(200).send({Message : "Request for setting orderstatus to received was sent"})
                    }
                })
            }
        })
        }
        catch {
            res.status(401).send({Error: "Something went wrong"})
        }
        
    },

    setDelivered(req, res) {
        try {
            amqp.connect(rabbitconfig.rabbit_connect, (error0, connection) => {
            if(error0) throw error0
            else {
                connection.createChannel((error1, channel) => {
                    if(error1) throw error1
                    else {
                        var exchange = 'orders-edit-status'

                        var message = {
                            _id : req.body._id,
                            status : "DELIVERED"
                        }

                        var payload = JSON.stringify(message)

                        channel.assertExchange(exchange, 'fanout', {durable:true})
                        channel.publish(exchange, '', Buffer.from(payload), {noAck : false})

                        res.status(200).send({Message : "Request for setting orderstatus to received was sent"})
                    }
                })
            }
        })
        }
        catch {
            res.status(401).send({Error: "Something went wrong"})
        }
        
    },

    setShipped(req, res) {
        try {
            amqp.connect(rabbitconfig.rabbit_connect, (error0, connection) => {
            if(error0) throw error0
            else {
                connection.createChannel((error1, channel) => {
                    if(error1) throw error1
                    else {
                        var exchange = 'orders-edit-status'

                        var message = {
                            _id : req.body._id,
                            status : "SHIPPED"
                        }

                        var payload = JSON.stringify(message)

                        channel.assertExchange(exchange, 'fanout', {durable:true})
                        channel.publish(exchange, '', Buffer.from(payload), {noAck : false})
                        res.status(200).send({Message : "Request for setting orderstatus to received was sent"})
                    }
                })
            }
        })
        }
        catch {
            res.status(401).send({Error: "Something went wrong"})
        }
        
    }
}