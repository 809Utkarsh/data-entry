const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Record = require('./models/Record');
const recordsRouter = require('./routes/records');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/cause', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected...');
        checkAndPopulateDatabase();
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process if connection fails
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

// app.post('/upload', upload.single('file'), (req, res) => {
//     console.log("Upload endpoint hit");
//     if (!req.file) {
//         return res.status(400).send('No file uploaded');
//     }

//     try {
//         const filePath = req.file.path;
//         populateDatabaseWithExcelData(filePath);
//         res.send('File data uploaded successfully');
//     } catch (err) {
//         console.error("Error processing file", err);
//         res.status(500).send(err.message);
//     }
// });

app.use('/records', recordsRouter);
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Function to check if data exists and populate if not
async function checkAndPopulateDatabase() {
    try {
        const count = await Record.countDocuments();
        if (count === 0) {
            await populateDatabaseWithExcelData();
        } else {
            console.log('Data already exists in the database, skipping population.');
        }
    } catch (err) {
        console.error('Error checking database:', err);
    }
}
 


function populateDatabaseWithExcelData() {
    const filePath = path.join(__dirname, 'UtkarshTask.xlsx'); // Adjust the path as needed
    if (fs.existsSync(filePath)) {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);

            // Assuming the first row of Excel sheet contains headers
            const excelHeaders = Object.keys(jsonData[0]);

            // Define your model properties
            const modelProperties = Object.keys(Record.schema.paths);

            // Match fields between Excel headers and model properties
            const fieldMatches = matchFields(excelHeaders, modelProperties);

            // Transform jsonData to match model properties with data type conversion
            const transformedData = jsonData.map(item => {
                let newItem = {};
                for (let key in item) {
                    if (fieldMatches[key]) {
                        
                        if (
                            fieldMatches[key] === 'companyId' ||
                            fieldMatches[key] === 'nbfcId' ||
                            fieldMatches[key] === 'loanId' ||
                            fieldMatches[key] === 'txnId' ||
                            fieldMatches[key] === 'disbAmount' ||
                            fieldMatches[key] === 'collAmount' ||
                            fieldMatches[key] === 'collAmount1' ||
                            fieldMatches[key] === 'collAmount2'
                        ) {
                            newItem[fieldMatches[key]] = parseFloat(item[key]);
                        } else {
                            newItem[fieldMatches[key]] = item[key]; // Assign other fields as usual
                        }
                    }
                }
                return newItem;
            });

            Record.insertMany(transformedData)
                .then(() => console.log('Database populated with Excel data successfully'))
                .catch(err => console.error('Error inserting data into DB:', err));
        } catch (err) {
            console.error('Error processing file:', err);
        }
    } else {
        console.error('Excel file not found');
    }
}

function matchFields(excelHeaders, modelProperties) {
    let matches = {};
    console.log(excelHeaders)
    console.log("modelProperties", modelProperties)
    for (let excelHeader of excelHeaders) {
        for (let prop of modelProperties) {
            // Remove spaces and convert to lowercase for case-insensitive matching
            const cleanHeader = excelHeader.toLowerCase().replace(/\s/g, "");
            const cleanProp = prop.toLowerCase().replace(/\s/g, "");

            if (cleanHeader === cleanProp) {
                matches[excelHeader] = prop;
                break; // Match found, move to the next Excel header
            }
        }
    }
    console.log("matches", matches)

    return matches;
}
