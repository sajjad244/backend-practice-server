const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;




// ? Middleware

app.use(cors());
app.use(express.json());


// ! mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jdvna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // ? came from node mongodb crud insert one
        const coffeeCollection = client.db("coffeeDB")
            .collection("coffee");

        // for userCollection
        const userCollection = client.db("coffeeDB")
            .collection("user");

        // ! mongodb crud get for getting data or read data

        // ? came from node mongodb crud insert one

        // ! mongodb crud get for getting data or read data
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find({}); // ? came from node mongodb crud find
            const result = await cursor.toArray();
            res.send(result);
        })

        // ! mongodb crud get for updating data or read data {step-1}
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query); // ? came from node mongodb crud find one
            res.send(result);
        })


        // ! mongodb crud post for creating new data or add data
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log('new coffee', newCoffee);
            const result = await coffeeCollection.insertOne(newCoffee);  // ? came from node mongodb crud insert one
            res.send(result);
        })

        // ! mongodb crud put for updating data or read data {step-2}
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCoffee = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: false };
            const updatedDoc = {
                $set: {
                    coffeeName: updatedCoffee.coffeeName,
                    supplier: updatedCoffee.supplier,
                    availableQuality: updatedCoffee.availableQuality,
                    quantity: updatedCoffee.quantity,
                    details: updatedCoffee.details,
                    photoUrl: updatedCoffee.photoUrl,
                    taste: updatedCoffee.taste
                },
            }
            const result = await coffeeCollection.updateOne(filter, updatedDoc, options); // ? came from node mongodb crud update one
            res.send(result);

        })

        // ! mongodb crud delete for deleting data
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query); // ? came from node mongodb crud delete
            res.send(result);
        })

        //! user related Api for firebase !!!!!____()

        app.get('/users', async (req, res) => {

            const cursor = userCollection.find(); // ? came from node mongodb crud find
            const result = await cursor.toArray();
            res.send(result);

        })


        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser, "new user");
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })


        app.patch("/users", async (req, res) => {
            const email = req.body.email;
            const filter = { email: email };
            const updatedDoc = {
                $set: {
                    lastLoginTime: req.body.lastLoginTime
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })


        //! user related Api for firebase !!!!!__()






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// ! mongodb



// /// ? Node express for run server !!!!

app.get('/', (req, res) => {
    res.send('Coffee making server is running!')
})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})