const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000 ;

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://user50:i6e0hGmMgvA7Q3QI@cluster0.x7kxg5y.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const usersCollection = client.db('PhoneMarket').collection('users')
const productsCollection = client.db('PhoneMarket').collection('products')
const cartCollection = client.db('PhoneMarket').collection('cartCollection')


app.get('/' , (req , res)=>{
    res.send('server running')
})



 const dbConnect = async ()=>{
    try {
         await client.connect()
         console.log('db-connect');
    } catch (error) {
        console.log(error.message);
    }
}


app.get('/products' , async(req , res)=>{
    try {
        const products = await productsCollection.find({}).toArray()
        res.send(products)
    } catch (error) {
        console.log(error.message);
    }
})

app.put('/users' , async(req , res)=>{
    try {
        const user = req.body;
        const result = await usersCollection.insertOne(user)
        res.send(result)
    } catch (error) {
        console.log(error.message);
    }
})


app.post('/addToCart' , async (req , res)=>{
    try {
        const product = req.body;
        const result = await cartCollection.insertOne(product);
        res.send(result);
    } catch (error) {
        console.log(error.message);
    }
})

app.get('/users/role/:email' , async(req , res)=>{
    try {
        const email = req.params.email
        const query = {email: email}
        const user = await usersCollection.findOne(query)
        res.send(user)
    } catch (error) {
        
    }
})

app.get('/cartProducts/:email' , async(req , res)=>{
    try {
        const email = req.params.email;
        const query = {buyrEamil: email}
        const cartProducts = await cartCollection.find(query).toArray()
        res.send(cartProducts)

    } catch (error) {
        console.log(error.message);
    }
})


app.delete('/cartProductDelte/:id' , async(req , res)=>{
   try {
    const id = req.params.id;
    const query = {_id: ObjectId(id)}
    const deletedProduct = await cartCollection.deleteOne(query)
    res.send(deletedProduct)
   } catch (error) {
    
   }
})

dbConnect()

app.listen(port , ()=>{
    console.log(`server running on port ${port}`);
})