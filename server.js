const express = require('express');
const app = express();
const port = 3001;

const fs = require('fs');

app.get('/', (req, res) => {
	//res.send('Hello World!');
	fs.readFile('speech_test.html', 'utf8', (err, data) => {
                if (err) {
                        console.error(err);
                        return;
                }
                res.send(data);
        });
});

app.listen(port, () => {
	console.log('Example app is listening on port ' + port);
});
