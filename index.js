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
     const database = client.db("NewsPortal");
     const newsCollection = database.collection("allnews");
     const usersCollection = database.collection("users");
        
        app.get("/news", async(req,res)=>{
            const loadNews = newsCollection.find({});
            const news = await loadNews.toArray();
            res.send(news);
        })

        app.get("/news/:type",async(req,res)=>{
            const type = req.params.type;
            const news = {type:type};
            const info = newsCollection.find(news);
            const result = await info.toArray();
            res.send(result)
        })

        app.delete("/news/:id", async(req,res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result =  await newsCollection.deleteOne(query)
            res.json(result)
        })
        
        app.post("/news",async(req,res)=>{
            const news = req.body;
            const result = await newsCollection.insertOne(news);
            res.json(result)
          })

        app.post("/user",async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result)
          })

        app.put("/news/:id",async(req,res)=>{
            const id = req.params.id;
            const news = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  type: news.type,
                  img: news.img,
                  time: news.time,
                  heading: news.heading,
                  details: news.details,
                },
              };
            const result = await newsCollection.updateOne(filter,updateDoc,options)
            res.json(result)
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
