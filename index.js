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
          name: "Puspa Love's Flowre",
          type: "Flower Plant",
          img: "https://m.media-amazon.com/images/I/81ADfcqZjIL._AC_UL480_FMwebp_QL65_.jpg",
          details: ` Package includes 8 bundles artificial calla lily flowers. Each bouquet houses 5 large stems, 20 adjustable leaves branches and 25 flowers head, generous and vivid.Each bunch of artificial flower is approx. 12"/30cm in length and 8"/20cm in width. Four colors for you to choose: white, red, yellow, purple, to create unique and romantic spring&summer atmosphere for your home. Our outdoor artificial flowers are made of environmental plastic, lifelike, high quality, UV resistant, never wither and not easy to fade, it keeps brillant color and blooming state year by year. Perfect garden decoration choice.`,
          price: 30,
          stock: 100,
          supplier: "Taposh",
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
