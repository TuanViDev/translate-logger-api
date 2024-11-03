const express = require('express');
const translate = require('translate-google');
const fs = require('fs');
const moment = require('moment-timezone');

const app = express();
app.use(express.json()); 


const writeLog = (logData) => {
    const logFilePath = 'log.json';


    fs.readFile(logFilePath, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            logs = JSON.parse(data);
        }

        const logId = logs.length;

        const time = moment().tz('Asia/Ho_Chi_Minh').format('HH:mm DD-MM-YYYY');

      
        const logDataWithId = {
            id: logId,
            time: time,  
            request: logData.request,
            response: logData.response
        };

        logs.push(logDataWithId); 
        
        
        // ghi log
        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Lỗi khi ghi vào file log:', err);
            }
        });
    });
};

app.post('/translate', async (req, res) => {
    const text = req.body.text; // request body

    if (!text) {
        return res.status(400).json({ message: 'Vui lòng gửi nội dung cần dịch.' });
    }

    try {
        const translatedText = await translate(text, { to: 'vi' });


        const logData = {
            request: text,
            response: translatedText
        };


        writeLog(logData);


        res.json({ original: text, translated: translatedText });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi dịch nội dung.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
