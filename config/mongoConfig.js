var env = {
    webPort: process.env.PORT || '3006',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'BallLogisticsCompanies'
}

// var dburl_env = "mongodb://localhost:27017/BallLogisticsCompanies";
var dburl_env = "mongodb://mongodb:27017/BallLogisticsCompanies"

module.exports = {
     env,
     dburl_env,
     'secret' : 'supersecret'
};