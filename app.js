const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose
	.connect(db, {useNewUrlParser: true})
	.then(console.log('MongoDB connected...'))
	.catch((err) => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({extended: false, useUnifiedTopology: true}));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});
