const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// MongoDB Atlas connection settings
mongoose.connect('mongodb+srv://shawn1080444:x8FVoW53VDBCO7H4@cluster1.np9fyen.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

const mongoURI = 'mongodb+srv://shawn1080444:x8FVoW53VDBCO7H4@cluster1.np9fyen.mongodb.net/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// create variable that will hold the connection and tell you whether you connected or not.
const db = mongoose.connection;
// This is for login
const validUser = {
  username: 'user123',
  email: 'mzwa@gmail.com',
  password: '123',
};

app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve static assets like CSS files
app.use(bodyParser.urlencoded({ extended: false }));

// This use
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a subscriber schema
const subscriberSchema = new mongoose.Schema({
  name : { type: String},
  number : { type: String},
  email: { type: String },
  message: {type:String}

});
const Subscriber = mongoose.model('Subscribers', subscriberSchema);
const ContactUs= mongoose.model('ContactUs', subscriberSchema);


app.get('/', (req,res)=> {
    res.render('index');
})
app.get('/about', (req,res)=> {
    res.render('about');
})
  
app.get('/beneficiaries', (req,res)=> {
    res.render('beneficiaries');
})
app.get('/login', (req,res)=> {
  res.render('log');
})

app.get('/contact', (req,res)=> {
    res.render('contact');
})

app.post('/dashboard', async(req, res) => {
  const { username, password, email } = req.body;
  if (username === validUser.username && password === validUser.password && email === validUser.email) {

  try {
    await client.connect();
    const collection = client.db('test').collection('subscribers');
    const data = await collection.find({}).toArray();

    const secondCons = client.db('test').collection('contactus');
    const secondData = await secondCons.find({}).toArray();
    res.render('loginHome', { data: data, secondData: secondData });
    
  } catch (err) {
    console.error('Failed to retrieve data from MongoDB:', err);
    res.status(500).send('Failed to retrieve data from MongoDB');
  } finally {
    await client.close();
  }

  // Check if entered credentials match the valid user
  } else {
    res.status(401).send('Invalid credentials. Please try again.');
  }
});
app.get('/subscribers', async (req,res)=> {
  await client.connect();
  const collection = client.db('test').collection('subscribers');
  const data = await collection.find({}).toArray();

  res.render('subscribers', {data : data })
})



app.post('/Contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const number = req.body.number;
  const message = req.body.message;
  // Create a new Subscriber document
  const contact = new ContactUs({ name, email , number, message });
  // Save the subscriber to the database
  contact.save()
  .then(() => {
    res.send('Thank you ' + name + ' for contacting us, we\'ll get back to you shortly!');
  })
  .catch((err) => {
    console.error(err);
    res.send('An error occurred while saving the Subscribers.');
  });

});

  // Handle form submission
  app.post('/subscribe', (req, res) => {
    const email = req.body.email;
    // Create a new Subscriber document
    const subscriber = new Subscriber({ email });
    // Save the subscriber to the database
    subscriber.save()
    .then(() => {
  
      console.log('Thank you for subscribing, subscriber added as : ' + email);
      res.render('subscribed');
    })
    .catch((err) => {
      console.error(err);
      res.send('An error occurred while saving the Subscribers.');
    });
  
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  