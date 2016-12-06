require('dotenv').config();
var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var cors = require('cors');
var bodyParser = require('body-parser');

var DB_NAME = process.env.DB_NAME;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST
});

var CharityOrganization = sequelize.define('charityOrganization', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  category: {
    type: Sequelize.STRING,
  },
  icon: {
    type: Sequelize.STRING,
  },
  coverImage: {
    type: Sequelize.STRING,
  },
  text: {
    type: Sequelize.STRING,
  }
}, {
  timestamps: false
});


app.use(cors());
app.use(bodyParser());

app.get('/api/charities', function (request, response) {
  var promise = CharityOrganization.findAll();
  promise.then(function(charities) {
    response.json({
      data: charities
    });
  });
});

app.post('/api/charities', function (request, response) {
  //response.json(request.body);
  var charity = CharityOrganization.build({
    name: request.body.name,
    category: request.body.category,
    text: request.body.text,
    icon: request.body.icon
  });
  charity.save().then(function(charity) {
    response.json(charity);
  })
});

var user = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  charityAccount: {
    type: Sequelize.INTEGER,
  },
  donatedAmount: {
    type: Sequelize.INTEGER,
    field: 'donated_amount'
  }
}, {
  timestamps: false
});


app.get('/api/donors', function (request, response) {
  var promise = user.findAll();
  promise.then(function(donors) {
    response.json({
      data: donors
    });
  });
});

var FinalTransaction = sequelize.define('final_transactions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  total_amount: {
    type: Sequelize.DECIMAL,
    field: 'total_amount'
  }
}, {
  timestamps: false
});

app.get('/api/transactions', function (request, response) {
  var promise = FinalTransaction.findAll();
  promise.then(function(transactions) {
    response.json({
      data: transactions
    });
  });
});

app.listen(process.ENV.PORT || 5000);
