require('dotenv').config();

const port = process.env.PORT || 4017;


const express=require('express');
const app=express();
const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

const db=mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', () => console.log('System connected to MongoDb Database'));
app.use(express.json());

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/medicalAppointment', doctorRoutes);
app.listen(port, () => {
    console.log(`Erick's Hospital Management System Server is running on port --> ${port}`);
});
module.exports = app;