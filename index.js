const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const ObjectId = require('mongodb').ObjectId;
app.use(fileUpload());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suylw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
 res.send('assalamualikum');
});
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
 const travelCollection = client.db("tripper").collection("reviews");
 const serviceCollection = client.db("tripper").collection("services");
 const orderCollection = client.db("tripper").collection("orders");

  // insert order info to database

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order);
    orderCollection.insertOne(order)
        .then((result) => {
            res.send(result.insertedCount > 0)
        })
})

 // insert service info to database
 app.post('/addService', (req, res) => {
    const service = req.body;
    console.log(service);

    // const file = req.files.file;
    // const name = req.body.name;
    // const price = req.body.price;
    // const description = req.body.description;
    // const newImg = file.data;
    // const encImg = newImg.toString('base64');

    // var image = {
    //     contentType: file.mimetype,
    //     size: file.size,
    //     img: Buffer.from(encImg, 'base64')
    // };

// serviceCollection.insertOne({name, price, description, image})
        serviceCollection.insertOne(service)
        .then((result) => {
            res.send(result.insertedCount > 0)
        })
})

 // insert review info to database
 app.post('/addReview', (req, res) => {
    const review = req.body;
    console.log(review);
    travelCollection.insertOne(review)
        .then((result) => {
            res.send(result.insertedCount > 0)
        })
})

// read services from database
app.get('/services', (req, res) => {
    serviceCollection.find({}).sort({ _id: -1 }).limit(3) 
        .toArray((err, documents) => {
            res.send(documents);
            console.log(err);
        })
})

// read individual services from database

app.get('/service/:serviceId', (req, res) => {
    serviceCollection.find({_id:ObjectId(req.params.serviceId)})
    .toArray((err, services) => {
        res.send(services[0]);
    })
})

 // read reviews from database
 app.get('/reviews', (req, res) => {
    travelCollection.find({}).sort({ _id: -1 }).limit(3) 
        .toArray((err, documents) => {
            res.send(documents);
            // console.log(err);
        })
})


// read specific order from database
app.get('/specificOrder', (req, res) => {
    orderCollection.find({ email: req.query.email })
        .toArray((err, documents) => {
            res.send(documents)
        })
})

});
app.listen(process.env.PORT || port);