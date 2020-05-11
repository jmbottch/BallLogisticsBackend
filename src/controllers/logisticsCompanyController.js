const LogisticsCompany = require('../models/logisticsCompany')
const amqp = require('amqplib')

//TODO: SEND MESSAGE WHEN COMPANY IS CREATED
//TODO: SEND MESSAGE WHEN COMPANY IS EDITED
//TODO: SEND MESSAGE WHEN COMPANY IS REMOVED

module.exports = {

    getAll (req, res) {
        LogisticsCompany.find()
        .then((companies) => {
            res.status(200).send(companies)
        })
        .catch((err) => {
            res.status(404).send(err)
        })
    },

    getOne(req,res) {
        LogisticsCompany.findOne({companyName : req.body.companyName})
        .then((company) => {
            res.status(200).send(company)
        })
        .catch((err) => {
            res.status(404).send({Message : "Company was not found."})
        })
    },

    create(req,res) {
        LogisticsCompany.create({
            companyName : req.body.companyName,
            smallPackageDeliveryPrices : req.body.smallPackageDeliveryPrices,
            mediumPackageDeliveryPrices : req.body.mediumPackageDeliveryPrices,
            largePackageDeliveryPrices : req.body.largePackageDeliveryPrices
        })
        .then((company) => {  
            res.status(200).send({Message : "Company has been created"})
        })
        .catch((err) => {
            if (err.name == 'MongoError' && err.code == 11000) {
                res.status(401).send({Error: "This company is already registered."})
            } else {
                res.status(402).send({Error : err})
            }
        })
    },

    update(req, res) {
        LogisticsCompany.findOne({companyName : req.body.companyName})
        .then((company) => {
            let smallPricesToSet = req.body.smallPackageDeliveryPrices
            let mediumPricesToSet = req.body.mediumPackageDeliveryPrices
            let largePricesToSet = req.body.largePackageDeliveryPrices

            if(req.body.smallPackageDeliveryPrices == '' || req.body.smallPackageDeliveryPrices == null || req.body.smallPackageDeliveryPrices === []) smallPricesToSet = company.smallPackageDeliveryPrices
            if(req.body.mediumPackageDeliveryPrices == '' || req.body.mediumPackageDeliveryPrices == null | req.body.mediumPackageDeliveryPrices === []) mediumPricesToSet = company.mediumPackageDeliveryPrices
            if(req.body.largePackageDeliveryPrices == '' || req.body.largePackageDeliveryPrices == null || req.body.largePackageDeliveryPrices === []) largePricesToSet = company.largePackageDeliveryPrices

            company.set({
                smallPackageDeliveryPrices : smallPricesToSet,
                mediumPackageDeliveryPrices : mediumPricesToSet,
                largePackageDeliveryPrices : largePricesToSet
            })
            company.save()
            .then(() => {
                res.status(200).send({Message : 'Company has been edited'})
            })
            .catch((err) => {
                res.status(401).send(err)
            })
        })
        .catch((err) => {
            res.status(404).send({Error : "Company not found"})
        })
    },

    remove(req,res) {
        LogisticsCompany.findOne({companyName : req.body.companyName})
        .then((company) => {
            company.remove()
            res.status(200).send({Message : "Company has been removed"})
        })
        .catch((err) => {
            res.status(404).send({Error : "Company not found"})
        })
    }
}