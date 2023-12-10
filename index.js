const express = require("express");
const dotenv = require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DBNAME}:${process.env.DBPASS}@cluster0.p8xem0j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function boostrap() {
  try {
    await client.connect();
    const productsCluster = client.db("pureNature").collection("products");
    const usersCluster = client.db("pureNature").collection("users");

    app.get("/", async (req, res) => {
      res.send("Pure Nature Server....");
      console.log("Pure Nature Server....");
    });

    app.get("/products", async (req, res) => {
      const cursor = productsCluster.find({});
      const result = await cursor.toArray();
      res.send(result);
      console.log(result.length);
    });

    app.post("/products", async (req, res) => {
      try {
        const data = {
          name: "Protable Kodal",
          type: "Agricultural Instruments",
          img: "https://m.media-amazon.com/images/I/71xYp-On-AL._AC_UL480_FMwebp_QL65_.jpg",
          details: ` Package includes 8 bundles artificial calla lily flowers. Each bouquet houses 5 large stems, 20 adjustable leaves branches and 25 flowers head, generous and vivid.Each bunch of artificial flower is approx. 12"/30cm in length and 8"/20cm in width. Four colors for you to choose: white, red, yellow, purple, to create unique and romantic spring&summer atmosphere for your home. Our outdoor artificial flowers are made of environmental plastic, lifelike, high quality, UV resistant, never wither and not easy to fade, it keeps brillant color and blooming state year by year. Perfect garden decoration choice.`,
          price: 609,
          stock: 100,
          supplier: "Kamrul",
        };
        const result = await productsCluster.insertOne(data);
        res.send(result);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/productsDetails/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCluster.findOne(query);
        res.send(result);
      } catch (error) {
        console.log(error);
        res.send("Internal error");
      }
    });

    app.get("/users", async (req, res) => {
      try {
        const cursor = usersCluster.find({});
        const result = await cursor.toArray();
        res.send(result);
        console.log(result.length);
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const cursor = await usersCluster.findOne(query);
        const result = cursor.toArray();
        if (result) {
          res.send(result);
        } else {
          res.send("User not found");
        }
      } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.post("/users", async (req, res) => {
      try {
        const userData = req.body;
        const result = await usersCluster.insertOne(userData);
        res.send(result);
        console.log(result);
      } catch (error) {
        res.send("Internal server error, user not regesterd properly!");
      }
    });

    app.listen(port, () => {
      console.log(`This port is running: ${port}`);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Database connecton successfull");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
boostrap().catch(console.dir);
