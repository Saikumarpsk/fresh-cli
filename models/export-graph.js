const mongoose = require('mongoose');

const GraphSchema = new mongoose.Schema({});
const ExportGraphModel = mongoose.model('well_management',GraphSchema,'well_management');

exports.ExportGraph = ExportGraphModel;