const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ObjectID,
} = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
// .env file config
require("dotenv").config();
// port
const port = process.env.PORT;
// middleware
app.use(cors());
app.use(express.json());
// app.use(express.json());
app.get("/", (req, res) => {
  res.send("I am running on the home.");
});

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.efpjwcu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("servicesDatabase")
      .collection("services");
    const reviewCollection = client
      .db("servicesDatabase")
      .collection("reviews");
    const addServicesCollection = client
      .db("servicesDatabase")
      .collection("addServices");
    // services data get
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // services limit
    app.get("/servicesLimit", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.sort({ _id: 1 }).limit(3).toArray();
      res.send(services);
    });

    app.post("/servicesLimit", async (req, res) => {
      const user = req.body;
      const result = await serviceCollection.insertOne(user);
      res.send(result);
    });
    // services get individually
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // review data get
    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    // review data post
    app.post("/reviews", async (req, res) => {
      const user = req.body;
      const result = await reviewCollection.insertOne(user);
      res.send(result);
    });
    // delete review
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    // get specific review item 
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });

    // add a service
    app.get("/addService", async (req, res) => {
      const query = {};
      const cursor = addServicesCollection.find(query);
      const addService = await cursor.toArray();
      res.send(addService);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
