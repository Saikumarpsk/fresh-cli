const mongoose = require('mongoose');
const express = require('express');
const exporter = require('highcharts-export-server');
const fs = require('fs');
const router = express.Router();
const fetch = require('node-fetch');

let xAxis = {
    type: "datetime",
    tickInterval: 7 * 24 * 3600 * 1000,
    labels: { y: 20, rotation: -45, align: 'right' }    
}

let arryOpposite = [false, true, false, true, false,true, false, true];
exporter.initPool();
router.get('/', (req,res) => {
    let dynamicYAxis = [];
    let dynamicSeries = [];
    const payload = JSON.stringify({
        "equipmentType": "ESP Well",
        "equipmentName": "BN-7D",
        "startDate": "2022-06-01",
        "endDate": "2022-06-21",
        "realTime": false,
        "spanish": false,
        "dataSource": "MODBUS",
        "setting": 1
    })

    fetch('/dms/api/chart/get_realtime_asset_data', {
    method: 'POST',
    body: payload,
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'authorization' : 'Bearer'
        }
    })
    // Parse JSON data
    .then((response) => response.json())
    
    // Showing response
    .then((json) => {
        json.data.chartResponse.map((result,index) => {
            if(!result.name.includes('sand_rate')
            && !result.name.includes('Virtual Flowrate, BFPD')
            && !result.name.includes('Virtual Flowrate, BOPD')
            && !result.name.includes('Production Bopd')
            && !result.name.includes("Well Test Bopd")) {
                dynamicYAxis.push({
                    title: {
                        text: result.name
                    },
                    lineWidth: 2,
                    title: {
                        text: ''
                    },
                    opposite:arryOpposite[index]
                })
                if(index == 0) {
                    dynamicSeries.push({
                        name: result.name,
                        type: 'spline',
                        data: result.data
                    })
                }else {
                    dynamicSeries.push({
                        name: result.name,
                        type: 'spline',
                        yAxis: index,
                        data: result.data
                    })
                }
            }            
        })
        let chartSettings = {
            type: 'png',
            constr:'StockChart',
            scale:'2',
            options : {
                chart: {
                    height:500
                },
                credits: {
                    enabled: false
                },
                title: {"text":"History Chart"},
                rangeSelector: {
                    enabled: false
                },
                xAxis:xAxis,
                yAxis:dynamicYAxis,
                series:dynamicSeries
            }
        };
        
        exporter.export(chartSettings, function (err, res) {
            let buff = new Buffer(res.data, 'base64');
            fs.writeFileSync(`BN-7D-History.png`, buff);           
            exporter.killPool();
            process.exit(1);
        });

        res.status(200).send(chartSettings);       
    })
    .catch(err => res.send(err))
})

module.exports = router; 