const mongoose = require('mongoose');
const express = require('express');
const { ExportGraph } = require('../models/export-graph');
const exporter = require('highcharts-export-server');
const fs = require('fs');
const router = express.Router();
router.get('/:id', async (req, res) => {
    try{
        const scada_real_time = await ExportGraph.findById(req.params.id);        
        res.status(200).json({
            status: "success",
            data: { scada_real_time },
        });
    }catch(err) {
        res.send(err);
    }    
});

router.get('/' , async (req,res) => {

    const pageOptions = {
        page: parseInt(req.query.page, 10) || 0,
        limit: parseInt(req.query.limit, 10) || 10
    }

    const { page = 1, limit = 10 } = req.query;

    try {
        const wellData = await ExportGraph.find().limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await ExportGraph.count();

        res.status(200).json({
            status: "success",
            data: { wellData },
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.send(error)
    }
})

module.exports = router; 