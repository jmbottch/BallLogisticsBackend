const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema ({

    orderNr : {
        type: Number,
        unique : true,
        required : [true, 'order number is required']
    },
    status : {
        type: String,
        required : [true, 'status is required']
    },
    shippingAddress : {
        street : String,
        city : String,
        zip: String
    },
    orderSize : {
        type : Number,
        required : [true, 'order size is required']
    }
})
const Order = mongoose.model('order', OrderSchema);
module.exports = Order;