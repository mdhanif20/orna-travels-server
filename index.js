const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
// const admin = require("firebase-admin"); 
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qytn8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
     await client.connect();
        const database = client.db("travelsInfo");
        const services = database.collection("services");
        const bookingDetails = database.collection("booking"); 

        app.get("/service", async(req,res)=>{
            const loadService = services.find({});
            const result = await loadService.toArray();
            res.send(result);
        })
        // booking set 
        app.post("/booking", async(req,res)=>{
          const customer = req.body;
          const result = await bookingDetails.insertOne(customer);
          res.json(result);
        }) 
         // booking get 
        app.get("/manageBooking",async(req,res)=>{
          const getCustomer = bookingDetails.find({});
          const customer = await getCustomer.toArray();
          res.send(customer);
        }) 
        //DELETE API
        app.delete("/manageBooking/:id",async(req,res)=>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await bookingDetails.deleteOne(query);
          res.json(result);
        })
        }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
