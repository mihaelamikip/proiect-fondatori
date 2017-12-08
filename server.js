var express = require("express")
var Sequelize = require("sequelize")
var nodeadmin = require("nodeadmin")


var sequelize = new Sequelize('dbFondatori', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model
var Founders = sequelize.define('founders', {
    founder_name: Sequelize.STRING,
    birthday: Sequelize.DATE,
    gender: Sequelize.STRING,
    id_founder:Sequelize.INTEGER,
    website:Sequelize.STRING,
    id_company:Sequelize.INTEGER
})

var Companies = sequelize.define('companies', {
    company_name: Sequelize.STRING,
    id_company: Sequelize.INTEGER,
    headquarters: Sequelize.STRING,
    founded_date: Sequelize.DATE,
    website: Sequelize.STRING,
    number_of_employees:Sequelize.INTEGER,
    revenue:Sequelize.DOUBLE
})


var app = express()

app.use('/nodeadmin', nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// get a list of companies
app.get('/companies', function(request, response) {
    Companies.findAll().then(function(categories){
        response.status(200).send(categories)
    })
        
})

app.get('/create', (req, res) => {
  sequelize.sync({force : true})
    .then(() => res.status(201).send('tables created'))
    .catch(() => res.status(500).send('error...'))
})


// get one company by id
app.get('/companies/:id', function(request, response) {
    Companies.findOne({where: {id:request.params.id}}).then(function(company) {
        if(company) {
            response.status(200).send(company)
        } else {
            response.status(404).send()
        }
    })
})

//create a new company
app.post('/companies', function(request, response) {
    Companies.create(request.body).then(function(company) {
        response.status(201).send(company)
    })
})

//update one company
app.put('/companies/:id', function(request, response) {
    Companies.findById(request.params.id).then(function(company) {
        if(company) {
            company.update(request.body).then(function(company){
                response.status(201).send(company)
            }).catch(function(error) {
                response.status(200).send(company)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//delete one company
app.delete('/companies/:id', function(request, response) {
    Companies.findById(request.params.id).then(function(company) {
        if(company) {
            company.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//get all founders
app.get('/founders', function(request, response) {
    Founders.findAll().then(
            function(founder) {
                response.status(200).send(founder)
            }
        )
})

//get one founder
app.get('/founders/:id', function(request, response) {
    Founders.findOne({where: {id:request.params.id}}).then(function(founder){
        if(founder){
            response.status(200).send(founder)
        } else {
            response.status(404).send()
        }
    })
})


//create a new founder
app.post('/founders', function(request, response) {
    Founders.create(request.body).then(function(founder) {
        response.status(201).send(founder)
    })
})


//update a founder
app.put('/founders/:id', function(request, response) {
    Founders.findById(request.params.id).then(function(founder) {
        if(founder) {
            founder.update(request.body).then(function(founder){
                response.status(201).send(founder)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//delete one founder
app.delete('/founders/:id', function(request, response) {
    Founders.findById(request.params.id).then(function(founder) {
        if(founder) {
            founder.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//get all the founders for one company
app.get('/companies/:id/founders', function(request, response) {
    Founders.findAll({where:{id_company: request.params.id}}).then(
            function(founder) {
                response.status(200).send(founder)
            }
        )
})

app.listen(8080)