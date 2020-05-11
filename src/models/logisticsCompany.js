const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const LogisticsCompanySchema = new Schema ({

    companyName : {
        type : String,
        unique : true,
        required : [true, 'Company name is required']
    },
    smallPackageDeliveryPrices : [{
        type: Number,
        required : [true, 'Small delivery Price is required']
    }],
    mediumPackageDeliveryPrices : [{
        type: Number,
        required : [true, 'Medium delivery Price is required']
    }],
    largePackageDeliveryPrices : [{
        type: Number,
        required : [true, 'Large delivery Price is required']
    }]

})

const LogisticsCompany = mongoose.model('logisticsCompany', LogisticsCompanySchema)
module.exports = LogisticsCompany