const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectID } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tejyxsb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const brandCollection = client.db("carBazarDB").collection("brands");
    const categoriesCollection = client
      .db("carBazarDB")
      .collection("categories");
    const bookingsCollection = client.db("carBazarDB").collection("bookings");
    const buyersCollection = client.db("carBazarDB").collection("buyers");

    app.get("/brands", async (req, res) => {
      const query = {};
      const cursor = categoriesCollection.find(query);
      const brands = await cursor.toArray();
      res.send(brands);
    });
    app.get("/category/:id", async (req, res) => {
      const category_id = req.params.id;
      const query = { category_id };
      const cursor = brandCollection.find(query);
      const categories = await cursor.toArray();
      res.send(categories);
    });
    app.get("/bookings", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      // console.log(booking);
      const query = {
        product: booking.product,
        email: booking.email,
      };
      const alreadyBooked = await bookingsCollection.find(query).toArray();
      if (alreadyBooked.length) {
        const message = `You already have a booking`;
        return res.send({ acknowledged: false, message });
      }
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });
    app.post("/buyers", async (req, res) => {
      const buyers = req.body;
      const result = await buyersCollection.insertOne(buyers);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", async (req, res) => {
  res.send("Car Bazar server is running");
});

app.listen(port, () => console.log(`Car Bazar running on ${port}`));
