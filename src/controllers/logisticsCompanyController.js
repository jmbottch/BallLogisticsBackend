const LogisticsCompany = require('../models/logisticsCompany')
const amqp = require('amqplib/callback_api')
const rabbitconfig = require('../../config/rabbitMQConfig')

module.exports = {

    getAll(req, res) {
        LogisticsCompany.find()
            .then((companies) => {
                res.status(200).send(companies)
            })
            .catch((err) => {
                res.status(404).send(err)
            })
    },

    getOne(req, res) {
        LogisticsCompany.findOne({ _id: req.body._id })
            .then((company) => {
                res.status(200).send(company)
            })
            .catch((err) => {
                res.status(404).send({ Message: "Company was not found." })
            })
    },

    create(req, res) {
        LogisticsCompany.create({
            companyName: req.body.companyName,
            smallPackageDeliveryPrices: req.body.smallPackageDeliveryPrices,
            mediumPackageDeliveryPrices: req.body.mediumPackageDeliveryPrices,
            largePackageDeliveryPrices: req.body.largePackageDeliveryPrices
        })
            .then((company) => {
                amqp.connect(rabbitconfig.rabbit_connect, (error0, connection) => {
                    if (error0) throw error0
                    else {
                        connection.createChannel((error1, channel) => {
                            if (error1) throw error1
                            else {
                                var exchange = 'logistics-register'

                                var message = {
                                    _id : company._id,
                                    companyName: company.companyName,
                                    smallPackageDeliveryPrices: company.smallPackageDeliveryPrices,
                                    mediumPackageDeliveryPrices: company.mediumPackageDeliveryPrices,
                                    largePackageDeliveryPrices: company.largePackageDeliveryPrices
                                }
                                var payload = JSON.stringify(message)

                                channel.assertExchange(exchange, 'fanout', {durable : true})
                                channel.publish(exchange, '', Buffer.from(payload), {noAck : false})

                                console.log("Message for registering " + company.companyName + " sent")
                                res.status(200).send({ Message: "Company registered and message sent to bus" })
                            }
                        })
                    }
                })
            })
            .catch((err) => {
                if (err.name == 'MongoError' && err.code == 11000) {
                    res.status(401).send({ Error: "This company is already registered." })
                } else {
                    res.status(402).send({ Error: err })
                }
            })
    },

    update(req, res) {
        LogisticsCompany.findOne({ _id: req.body._id })
            .then((company) => {
                let smallPricesToSet = req.body.smallPackageDeliveryPrices
                let mediumPricesToSet = req.body.mediumPackageDeliveryPrices
                let largePricesToSet = req.body.largePackageDeliveryPrices

                if (req.body.smallPackageDeliveryPrices == '' || req.body.smallPackageDeliveryPrices == null || req.body.smallPackageDeliveryPrices === []) smallPricesToSet = company.smallPackageDeliveryPrices
                if (req.body.mediumPackageDeliveryPrices == '' || req.body.mediumPackageDeliveryPrices == null | req.body.mediumPackageDeliveryPrices === []) mediumPricesToSet = company.mediumPackageDeliveryPrices
                if (req.body.largePackageDeliveryPrices == '' || req.body.largePackageDeliveryPrices == null || req.body.largePackageDeliveryPrices === []) largePricesToSet = company.largePackageDeliveryPrices

                company.set({
                    smallPackageDeliveryPrices: smallPricesToSet,
                    mediumPackageDeliveryPrices: mediumPricesToSet,
                    largePackageDeliveryPrices: largePricesToSet
                })
                company.save()
                    .then(() => {
                        amqp.connect(rabbitconfig.rabbit_connect, (error0, connection) => {
                            if (error0) throw error0
                            connection.createChannel((error1, channel) => {
                                if (error1) throw error1
                                var exchange = "logistics-edit"
                                // var msg = req.body
                                var message = {
                                    _id : company._id,
                                    companyName: company.companyName,
                                    smallPackageDeliveryPrices: smallPricesToSet,
                                    mediumPackageDeliveryPrices: mediumPricesToSet,
                                    largePackageDeliveryPrices: largePricesToSet
                                }
                                let payload = JSON.stringify(message)

                                channel.assertExchange(exchange, 'fanout', {durable: true})
                                channel.publish(exchange, '', Buffer.from(payload), {noAck: false})

                                console.log("message for editing " + company.companyName + " sent to bus")
                                res.status(200).send({ result: "Company Updated and message added to the queue" })
                            })
                        })                       
                    })
                    .catch((err) => {
                        res.status(401).send(err)
                    })
            })
            .catch((err) => {
                res.status(404).send({ Error: "Company not found" })
            })
    },

    remove(req, res) {
        LogisticsCompany.findOne({ _id: req.body._id })
            .then((company) => {
                company.remove()
                amqp.connect(rabbitconfig.rabbit_connect, (error0, connection) => {
                    if(error0) throw error0
                    else {
                        connection.createChannel((error1, channel) => {
                            if(error1) throw error1
                            else {
                                var exchange = 'logistics-remove'
                                var message = {
                                    _id : req.body._id
                                }
                                var payload = JSON.stringify(message)

                                channel.assertExchange(exchange, 'fanout', {durable: true})
                                channel.publish(exchange, '', Buffer.from(payload), {noAck: false})

                                console.log("Message for removing " + req.body.companyName + " was sent to the bus")
                                res.status(200).send({Message : "Company removed and message sent to bus"})
                            }
                        })
                    }
                })
            })
            .catch((err) => {
                res.status(404).send({ Error: "Company not found" })
            })
    }
}