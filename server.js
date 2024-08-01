require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Car = require('./models/car')
const PORT = 3000
const MONGO_URI = process.env.MONGO_URI
const logger = require ('morgan')
const methodOverride = require('method-override')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('tiny'));
app.use(methodOverride('_method'));

mongoose.connect(MONGO_URI);

mongoose.connection.once('open', () => {
    console.log('Connection with Mongo is rocking!')
});

mongoose.connection.on('error', () => {
    console.error('MongoDB is big mad!')
});

// Create
app.post('/cars', async (req, res) => {
    req.body.isOn === 'on' || req.body.isOn === true? 
    req.body.isOn = true : 
    req.body.isOn = false
    try {
        const createdCar = await Car.create(req.body)
        res.redirect(`/cars/${createdCar._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.get('/cars/new', (req, res) => {
    res.render('new.ejs')
})
// Read
app.get('/cars', async(req, res) => {
    try {
        const foundCars = await Car.find({})
        res.render('index.ejs', {
            cars: foundCars
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.get('/cars/:id', async (req, res) => {
    try {
        const foundCar = await Car.findOne({ _id: req.params.id })
        res.render('show.ejs', {
            car: foundCar
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// Update
app.get('/cars/:id/edit', async (req, res) => {
    try{
        const foundCar = await Car.findOne({ _id: req.params.id }, req.body, { new: true})
        res.render('edit.ejs', {
            car: foundCar
        })
    } catch(error){
        res.status(400).json({ msg: error.message })
    }
});

app.put('/cars/:id/', async (req, res) => {
    try {
        const updatedCar = await Car.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.redirect(`/cars/${updatedCar._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})


// Delete
app.delete('/cars/:id', async (req, res) => {
    try{
        await Car.findOneAndDelete({ _id: req.params.id })
        .then((note) => {
            res.sendStatus(204)
        })
    } catch(error){
        res.status(400).json({ msg: error.message })

    }
});

// Port
app.listen(PORT, () => {
    console.log('We vibing' 
        + `application is allowing requests on PORT ${PORT}`)
});