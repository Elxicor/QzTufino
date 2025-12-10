const express = require("express");
const doctor = require("../models/doctor");
const router = express.Router();

router.get("/doctors", async (req, res) => {
    try {
        const doctors = await doctor.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get("/doctors/:id", async (req, res) => {
    try {
        const doctorFound = await doctor.findById(req.params.id);
        if (!doctorFound) {
            return res.status(404).json({message: "Doctor no encontrado"});
        }
        res.json(doctorFound);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get("/doctors-stats/summary", async (req, res) => {
    try {
        const doctors = await doctor.find();
        
        const totalDoctores = doctors.length;
        
        const doctoresPorEspecialidad = doctors.reduce((acc, doc) => {
            const especialidadId = doc.especialidadId;
            acc[especialidadId] = (acc[especialidadId] || 0) + 1;
            return acc;
        }, {});
        
        const doctoresPorEstado = doctors.reduce((acc, doc) => {
            const estado = doc.estado || 'Sin definir';
            acc[estado] = (acc[estado] || 0) + 1;
            return acc;
        }, {});
        
        const doctoresActivos = doctors.filter(doc => doc.estado === 'activo').length;
        const porcentajeActivos = totalDoctores > 0 ? ((doctoresActivos / totalDoctores) * 100).toFixed(2) : 0;
        
        const especialidadMasDoctores = Object.entries(doctoresPorEspecialidad)
            .sort((a, b) => b[1] - a[1])[0];
        
        res.json({
            totalDoctores,
            doctoresActivos,
            doctoresInactivos: totalDoctores - doctoresActivos,
            porcentajeActivos: `${porcentajeActivos}%`,
            distribucionPorEspecialidad: doctoresPorEspecialidad,
            distribucionPorEstado: doctoresPorEstado,
            especialidadMasPopular: especialidadMasDoctores ? {
                especialidadId: Number(especialidadMasDoctores[0]),
                cantidadDoctores: especialidadMasDoctores[1]
            } : null
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post("/doctors", async (req, res) => {
    const doctorObject = new doctor({
        _id: req.body._id,
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        correo: req.body.correo,
        horario: req.body.horario,
        estado: req.body.estado,
        especialidadId: req.body.especialidadId
    });
    try {
        const newDoctor = await doctorObject.save();
        res.status(201).json(newDoctor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.put("/doctors/:id", async (req, res) => {
    try {
        const updatedDoctor = await doctor.findByIdAndUpdate(
            req.params.id,
            {
                nombre: req.body.nombre,
                telefono: req.body.telefono,
                correo: req.body.correo,
                horario: req.body.horario,
                estado: req.body.estado,
                especialidadId: req.body.especialidadId
            },
            { new: true }
        );
        if (!updatedDoctor) {
            return res.status(404).json({message: "Doctor no encontrado"});
        }
        res.json(updatedDoctor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/doctors/:id", async (req, res) => {
    try {
        const deletedDoctor = await doctor.findByIdAndDelete(req.params.id);
        if (!deletedDoctor) {
            return res.status(404).json({message: "Doctor no encontrado"});
        }
        res.json({message: "Doctor eliminado exitosamente", doctor: deletedDoctor});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;
