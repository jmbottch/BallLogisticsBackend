const orderController = require('../src/controllers/orderController')

module.exports = (app) => {

    //get list of all orders
    app.get('/api/orders', orderController.getAll)

    //get a single order
    app.get('/api/order', orderController.getOne)

    //set an order to received
    app.post('/api/orders-received', orderController.setReceived)

    //set an order to received
    app.post('/api/orders-shipped', orderController.setShipped)

    //set an order to received
    app.post('/api/orders-delivered', orderController.setDelivered)
}