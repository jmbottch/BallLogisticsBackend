const logisitcsCompanyController = require('../src/controllers/logisticsCompanyController')

module.exports = (app) => {
    //get list of all Logistics Companies
    app.get('/api/companies', logisitcsCompanyController.getAll)
    
    //get data of a single Logistics Company
    app.get('/api/companies', logisitcsCompanyController.getOne)

    //create a new Logistics Company
    app.post('/api/companies', logisitcsCompanyController.create)

    //edit a Logistics Company
    app.put('/api/companies', logisitcsCompanyController.update)
    
    //remove a Logistics Company
    app.delete('/api/companies', logisitcsCompanyController.remove)
}