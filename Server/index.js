require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2; // Use v2 for the latest features
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Api_Key,
    api_secret: process.env.Api_Secret,
});
app.use(cors({
    origin: ["http://localhost:5173",
        "http://localhost:5174",
        "https://career-venture.web.app",
        "https://career-venture.firebaseapp.com/"


    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { appendFile } = require('fs');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pflyccd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
app.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1y'
    })
    res.send({ token });

})
const verifyToken = (req, res, next) => {
    if (!req?.headers?.authorization) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'Unauthorized Access' });
        }
        req.decoded = decoded
        next();
    })

}
async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

       const database = client.db('TravelleoDb');
       const userCollections = database.collection('users');
    
   

       

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const query = { email: newUser.email };
            const existingUser = await userCollections.findOne(query); // Use the correct variable name

            if (existingUser) {
                res.send({ message: "User already exists", insertedId: null });
                return;
            }

            const result = await userCollections.insertOne(newUser); // Use the correct variable name
            res.send(result);
        });
        app.get('/users', async (req, res) => {
            const cursor = userCollections.find({});
            const results = await cursor.toArray();
            res.send(results);
        }
        );

        app.patch('/users/block/:email', async (req, res) => {
            const email = req.params.email;

            // Find the user by email to determine their role
            const user = await userCollections.findOne({ email: email });

            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }


            if (user.role === 'member') {
                const update = { $set: { status: 'blocked' } };
                const result = await userCollections.updateOne({ email: email, role: 'member' }, update);
                return res.send(result); // Send result for member update
            } else if (user.role === 'mentor') {
                const update = { $set: { status: 'pending' } };
                const result = await userCollections.updateOne({ email: email, role: 'mentor' }, update);
                return res.send(result); // Send result for mentor update
            } else {
                return res.status(400).send({ message: 'Invalid role for this operation' });
            }
        });
        app.get('/users/member', async (req, res) => {
            const query = { role: "member", status: "active" };
            const cursor = userCollections.find(query);
            const results = await cursor.toArray();
            res.send(results);
        });

       

 

        app.get('/users/member/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);

            const query = { email: email, role: "member" };
            // console.log(query);

            const user = await userCollections.findOne(query);
            // console.log(user);

            res.send(user);
        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };

            const user = await userCollections.findOne(query);
            res.send(user);
        });
      
      

      
      



      
  
    
       

      
      
  
      


      

      




        ///payment related api

        app.post("/create_payment_intent", async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',

                payment_method_types: ['card']
            });

            res.send({
                clientSecret: paymentIntent.client_secret

            });
            // console.log('secret', paymentIntent.client_secret);
        }
        );
        app.post('/payments', async (req, res) => {
            const payment = req.body;
            const paymentResult = await paymentCollection.insertOne(payment);


            // console.log('payment info', payment);


            res.send(payment);
        })
        //approve payment status

        app.get('/payments', async (req, res) => {
            const cursor = paymentCollection.find({});
            const results = await cursor.toArray();
            res.send(results);
        });
        app.get('/payments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await paymentCollection.findOne(query);
            res.send(result);
        });
        app.get('/payments/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = paymentCollection.find(query);
            const results = await cursor.toArray();
            res.send(results);
        }
        );
        
      

        app.put('/payments/approve/:id', async (req, res) => {
            const id = req.params.id;
            const { status } = req.body; // assuming the status is passed in the request body

            if (status !== 'approved') {
                return res.status(400).send({ error: 'Invalid status' });
            }

            try {
                const result = await paymentCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { status: 'approved' } }
                );
                if (result.modifiedCount === 0) {
                    return res.status(404).send({ error: 'Payment not found' });
                }
                res.send({ message: 'Payment approved' });
            } catch (err) {
                res.status(500).send({ error: 'Failed to approve payment' });
            }
        });
        //user profile update
        app.patch('/users/update/:email', async (req, res) => {
            const email = req.params.email;
            const update = req.body;
            const query = { email: email };
            const result = await userCollections.updateOne(query, { $set: update });
            res.send(result);
        });
        app.patch("/users/admin-toggle/:email", async (req, res) => {
            const email = req.params.email;
            const { role } = req.body; // Expect 'admin' or 'user' in request body
            const query = { email: email };
            const update = { $set: { role: role } };

            try {
                const result = await userCollections.updateOne(query, update);
                res.send(result);
            } catch (error) {
                console.error("Error updating user role:", error);
                res.status(500).send({ message: "Failed to update user role" });
            }
        });
        //block a user
        app.patch('/users/toggleStatus/:email', async (req, res) => {
            try {
                const { email } = req.params;
                const { status } = req.body; // Expect "blocked" or "active" in the request body

                if (!email) {
                    return res.status(400).send({ message: "User email is required" });
                }
                if (!status || (status !== "blocked" && status !== "active")) {
                    return res
                        .status(400)
                        .send({ message: "Valid status ('blocked' or 'active') is required" });
                }

                const updatedUser = await userCollections.findOneAndUpdate(
                    { email },
                    { $set: { status } },
                    { new: true }
                );

                if (!updatedUser) {
                    return res.status(404).send({ message: "User not found" });
                }

                res
                    .status(200)
                    .send({ message: `User ${status} successfully`, user: updatedUser });
            } catch (error) {
                console.error("Error updating user status:", error);
                res.status(500).send({ message: "Failed to update user status" });
            }
        }
        );


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Your Career is awaiting for an adventure!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


