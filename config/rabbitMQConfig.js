var orderRegisterQueue = 'orders-register'
var orderEditQueue = 'orders-edit'
var orderRemoveQueue = 'orders-remove'

var exchangeList = [
    orderRegisterQueue,
    orderEditQueue,
    orderRemoveQueue
]

var rabbit_connect = 'amqp://rabbitmq:5672'

module.exports = {
    exchangeList,
    rabbit_connect
}
