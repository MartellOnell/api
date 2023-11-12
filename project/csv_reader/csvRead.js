import csv from "csv-parser"
import * as fs from "fs"
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const cleanRow = async (object, keys, handleToData) => {
    try {
        const dataToInsert = {
            nomenclature: '',
            name: '',
            manufacturer: '',
            vendorCode: '',
            coast: '',
            category: '',
            subcategory: '',
            tip: '',
            color: ''
        }

        const objectLabel = keys[0]
        let objectValue = object[keys[0]]

        if (object._1) {
            for (let i = 1; i < keys.length; i++) {
                const elem = object[keys[i]]
                objectValue += elem
            }
        }

        let cleanValue = objectValue.split(';')
        let cleanLabel = objectLabel.split(';')
        cleanValue = cleanValue.splice(1, cleanValue.length)
        cleanLabel = cleanLabel.splice(1, cleanLabel.length)

        const dataToInsertKeys = Object.keys(dataToInsert)
        for (let i = 0; i < dataToInsertKeys.length; i++) {
            dataToInsert[dataToInsertKeys[i]] = cleanValue[i]
        }

        return dataToInsert
    } catch {
        throw Error('error in callback')
    }
}



export const readCsv = async (pathToFile, handleToData, handleToEnd) => {
    let readStream = fs.createReadStream(pathToFile)
    readStream
        .pipe(csv())
        .on('data', (data) => {
            cleanRow(data, Object.keys(data))
                .then(res => {
                    handleToData(res)
                })
                .catch(err => {
                    readStream.destroy()
                })
        })
        .on('end', () => {
            return "data saved"
        })
        .on('close', (err) => {
            if (err) {
                console.log(err)
            } else {
                handleToEnd()
            }
            console.log("closed")
        })
} 