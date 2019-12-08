const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev');
const rental = require('./models/rental');
const FakeDb = require('./Fakedb');
const rentalRoutes = require('./routes/rentals');
const userRoutes = require('./routes/users');

mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to mongoDb');
    const fakeDb = new FakeDb();
    fakeDb.seedDb();
}).catch((err) => console.log(err));


const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/users', userRoutes); 
/**Testing app endpoint 
app.get('/rentals', (req, res) => {
    res.json({
        'success': true
    });
});
*/
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});