const express = require('express');
const db = require('./config/database');
const app = express();
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get('/api/vegetables', (req, res) => {
    db.query('SELECT * FROM vegetables', (err, results) => {
        if (err) throw err;
        res.json({
            status: true,
            message: 'Success Get Data',
            data: results
        });
    });
});

// Get a vegetable by ID
app.get('/api/vegetables/(:id)', (req, res) => {
    // const { id } = req.params;
    let id = req.params.id;

    db.query(`SELECT * FROM vegetables WHERE id = ${id}`, (err, results) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if post not found
        if (results.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Post Not Found!',
            })
        }
        // if post found
        else {
            return res.status(200).json({
                status: true,
                message: 'Detail Data Post',
                data: results[0]
            })
        }
    });
});

//insert vegetables
app.post('/api/vegetables', [
    body('name').notEmpty(),
    body('price').notEmpty(),
    body('unit').notEmpty(),
    body('plant_type').notEmpty(),

], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        name: req.body.name,
        price: req.body.price,
        unit: req.body.unit,
        plant_type: req.body.plant_type
    }
    // const { name, price, unit, plant_type } = req.body;
    /* db.query('INSERT INTO vegetables (name, price, unit, plant_type) VALUES (?, ?, ?, ?)', [name, price, unit, plant_type], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Item added successfully', id: result.insertId });
    
    }); */
    db.query('INSERT INTO vegetables SET ?', formData, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Insert Data Successfully',
                data: result[0]
            })
        }
    });
});

//update vegetables from id
app.patch('/api/update/(:id)', [
    body('name').notEmpty(),
    body('price').notEmpty(),
    body('unit').notEmpty(),
    body('plant_type').notEmpty(),

], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let id = req.params.id;

    //define formData
    let formData = {
        name: req.body.name,
        price: req.body.price,
        unit: req.body.unit,
        plant_type: req.body.plant_type
    }
    db.query(`UPDATE vegetables SET ? WHERE id = ${id}`, formData, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Update Data Successfully',
                data: result[0]
            })
        }
    });
});

//delete vegetables from id
app.delete('/api/delete/(:id)', (req, res) => {
    let id = req.params.id;

    db.query(`DELETE FROM vegetables WHERE id = ${id} `, (err) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Data Successfully!',
            })
        }
    });
});


app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
