const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    companyId: { type: String }, // Text formatted number in Excel
    companyName: String,
    nbfcId: { type: String }, // Text formatted number in Excel
    nbfcName: String,
    loanType: String,
    status: String,
    loanId: { type: String }, // Text formatted number in Excel
    txnId: { type: String }, // Text formatted number in Excel
    disbAmount: { type: String }, // Text formatted number in Excel
    disbDate: Date, // Assuming valid date format after conversion
    collAmount: { type: String }, // Text formatted number in Excel
    collDate: Date, // Assuming valid date format after conversion
    collAmount1: { type: String }, // Text formatted number in Excel
    collDate1: Date, // Assuming valid date format after conversion
    collAmount2: { type: String }, // Text formatted number in Excel
    collDate2: Date, // Assuming valid date format after conversion
});

module.exports = mongoose.model('Record', RecordSchema);
