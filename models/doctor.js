const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema(
    {
        _id: {type: Number},
        nombre: {type: String},
        telefono: {type: String},
        correo: {type: String},
        horario: {type: String},
        estado: {type: String},
        especialidadId: {type: Number}
    },
    {
        collection: "Doctors",
        _id: false
    }
);
doctorSchema.set('_id', true);
module.exports = mongoose.model("Doctor", doctorSchema);
