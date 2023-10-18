const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://shawn1080444:x8FVoW53VDBCO7H4@cluster1.np9fyen.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const mongoURI = 'mongodb+srv://shawn1080444:x8FVoW53VDBCO7H4@cluster1.np9fyen.mongodb.net/';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// create variable that will hold the connection and tell you whether you connected or not.
const db = mongoose.connection;

const validUser = {
  username: 'zimkhitha',
  email: 'zam@zam.com',
  password: 'Zam123',
};

app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve static assets like CSS files
app.use(bodyParser.urlencoded({ extended: false }));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const subscriberSchema = new mongoose.Schema({
  name : { type: String},
  number : { type: String},
  email: { type: String },
  message: {type:String}

});

const beneficiariesSchema = new mongoose.Schema({
  name : { type : String},
  surname : {type : String},
  address : {type : String},
  numbers : { type : String},
  id_number : {type : Number},
  grade : {type : Number},
  message : {type : String}
})
const Subscriber = mongoose.model('Subscribers', subscriberSchema);
const ContactUs= mongoose.model('ContactUs', subscriberSchema);
const Beneficiary = mongoose.model('Beneficiary', beneficiariesSchema )

app.get('/', (req,res)=> {
    res.render('index');
})
app.get('/about', (req,res)=> {
    res.render('about');
})
  
app.get('/beneficiaries', (req,res)=> {
    res.render('beneficiaries');
})
app.post('/beneficiaries', (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const address = req.body.address;
  const id_number = req.body.idnum;
  const numbers = req.body.numbers;
  const grade = req.body.grade;
  const message = req.body.motivation;
  // Create a new Subscriber document
  const beneficiaries = new Beneficiary({ name,surname,address, id_number, numbers, grade, message});
  beneficiaries.save()
  .then(() => {
    res.send('Thank you ' + name + ' for applying as our beneficiary, we\'ll get back to you shortly!');
  })
  .catch((err) => {
    console.error(err);
    res.send('An error occurred while saving the Subscribers.');
  });

});
app.get('/contact', (req,res)=> {
  res.render('contact');
})

app.get('/login', (req,res)=> {
  res.render('log');
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
  } else {
    res.status(401).send('Invalid credentials. Please try again.');
  }
});
app.get('/contact-us', async (req, res)=> {
  try {
    await client.connect();
    const collection = client.db('test').collection('subscribers');
    const data = await collection.find({}).toArray();

    const secondCons = client.db('test').collection('contactus');
    const secondData = await secondCons.find({}).toArray();
    res.render('contactus', { data: data, secondData: secondData });
    
  } catch (err) {
    console.error('Failed to retrieve data from MongoDB:', err);
    res.status(500).send('Failed to retrieve data from MongoDB');
  } finally {
    await client.close();
  }

  })
  
app.get('/subscribers', async (req,res)=> {
  await client.connect();
  const collection = client.db('test').collection('subscribers');
  const data = await collection.find({}).toArray();

  res.render('subscribers', {data : data })
})

app.get('/nominee', async (req, res)=> {
  await client.connect();
  const collectData = client.db('test').collection('beneficiaries');
  const data = await collectData.find({}).toArray();

  res.render('nominees', {data : data} )
})


app.post('/Contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const number = req.body.number;
  const message = req.body.message;
  // Create a new Subscriber document
  const contact = new ContactUs({ name, email , number, message });
  contact.save()
  .then(() => {
    res.send('Thank you ' + name + ' for contacting us, we\'ll get back to you shortly!');
  })
  .catch((err) => {
    console.error(err);
    res.send('An error occurred while saving the Subscribers.');
  });

});

  app.post('/subscribe', (req, res) => {
    const email = req.body.email;
    const subscriber = new Subscriber({ email });
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
  