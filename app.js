//main js
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const { ObjectId } = require('bson');



const app = express();

//for name properties read
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static(__dirname + '/public'));


let db;
const url = 'mongodb://localhost:27017';
const dbName = 'GoWeather'; 
const client = new MongoClient(url);


app.get('/', (req, res) => {
   res.sendFile(__dirname + '/public/index.html');
});


app.get('/cities', (req, res) => {
   db.collection('cities').find().toArray((err,docs) => {
      if(err) {
         console.log(err);
         return res.sendStatus(500);
      }
      res.send(docs);
   })
});


app.get('/cities/:id', (req, res) => {
   db.collection('cities').findOne({_id: ObjectId(req.params.id)}, (err,docs) => {
      if(err) {
         console.log(err);
         return res.sendStatus(500);
      }
      res.send(docs);
   });
});


app.post('/cities', (req,res) => {
   let city = {
      id: Date.now(),
      name: req.body.name
   };
   db.collection('cities').insertOne(city, (err) => {
      if(err) {
         console.log(err);
         return res.sendStatus(500);
      }
      res.send(city);
   })
})


app.put('/cities/:id', (req,res) => {
   db.collection('cities').updateOne({_id: ObjectId(req.params.id)}, {$set:{name:req.body.name}}, (err,result) => {
      if(err) {
         console.log(err);
         return res.sendStatus(500);
      }
      res.send(req.body.name);
   })
})

app.delete('/cities/:id', (req,res) => {
   db.collection('cities').deleteOne({_id: ObjectId(req.params.id)}, (err,result) => {
      if(err) {
         console.log(err);
         return res.sendStatus(500);
      }
      res.sendStatus(200);
   })
})



client.connect(err => {
   if(err) throw err;
   console.log("connected to server");
   db = client.db(dbName);
   app.listen(3030, () => console.log("API started"));
})

