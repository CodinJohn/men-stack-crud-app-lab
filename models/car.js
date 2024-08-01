const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    model: { type: String, required: true },
    color: { type: String, required: true },
    body: { type: String, required: true },
    isOn: { type: Boolean, required: true }
});

const Car = mongoose.model('Car', carSchema)

module.exports = Car