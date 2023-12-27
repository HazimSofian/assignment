
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const jwt = require('jsonwebtoken');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Azraii_12:Kiri-12@cluster27.pgoifwj.mongodb.net/MuseumVisitorSystem";
const dbName = "MuseumVisitorSystem";
const usersCollectionDB = "users";
const visitorsCollectionDB = "visitors";
const { ObjectId } = require('mongodb');
const moment = require('moment-timezone');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyVMS API',
      version: '1.0.0',
    },
  },
  apis: ['./swagger.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());


const client = new MongoClient(uri,{
  serverApi:{
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors:true,
  }
});

app.use(express.json());
let dbUsers = [
  {
    username: "hazeem08",
    password: "0987654321",
    name: "hazimfahmi",
    email: "hazimjr763@gmail.com",
    role  : "user"
  },
  {
    username: "security",
    password: "123456789",
    name: "Pak Guard",
    email: "Pak guard.com",
    role  : "security"
  },
  {
    username: "admin",
    password: "password",
    email : "admin@example.com",
    role: "admin"
  }
]
let dbVisitors = [
  {
    visitorname: "John Placebo",
    visitorpass: "john123",
    id: "871212053345",
    phoneNumber: "010202067543",
    email: "johnplacebo@example.com",
    appointmentDate: "2023-06-21",
    carPlate: "JLB4102",
    purpose: "Majlis Convo",
    destination:"Dewan Seminar",
    registeredBy: "hazeemfahmii"
  },
  {
    visitorname: "Jenny Kim",
    visitorpass: "Jenny123",
    id: "090909048454",
    phoneNumber: "0987654321",
    email: "jenniebp@example.com",
    appointmentDate: "2023-06-22",
    carPlate: "XYZ2987",
    purpose: "Mesyuarat PIBG",
    destination:"Fakulti Mekanikal",
    registeredBy: "Albino Rafael"
  },
  // Add more visitors as needed
];

client.connect().then(() => {
  console.log('Connected to MongoDB');

app.post('/login', (req, res) => {
  let data = req.body;
  let user = login(data.username, data.password);

  if (user.role === 'admin') {
    res.send(generateToken(user, 'admin'));
  } else if (user.role === 'user') {
    res.send(generateToken(user, 'user'));
  } else if (user.role === 'security') {
    res.send(generateToken(user, 'security'));
  } else {
    res.send({ error: "User not found" });
  }
});

app.post('/register', verifyToken, async (req, res) => {
  if (req.user.role === 'admin') {
    let data = req.body;
    let username = data.username;
    let match = dbUsers.find(element => element.username === username);
    if (match) {
      res.send("Error! User already registered.");
    } else {
      let result = await register(
        data.username,
        data.password,
        data.name,
        data.email,
        data.role
      );
      if (result.status === 'Registration successful!') {
        await updateUsersCollection(); // Update the users collection in MongoDB
      }
      res.send(result);
    }
  } else {
    res.send("Unauthorized");
  }
});


app.post('/addvisitors', verifyToken, async (req, res) => {
  if (req.user.role === 'user') {
    let data = req.body;
    let id = data.id;
    let match = dbVisitors.find(element => element.idnumber === id);
    if (match) {
    res.send("Error! Visitor data already in the system.");
    } else 
    {
      let result = await addvisitor(
        data.visitorname,
        data.id, 
        data.visitorpass,
        data.phoneNumber,
        data.email,
        data.appointmentDate,
        data.carPlate,
        data.purpose,
        data.destination,
        data.registeredBy
      );
      if (result === 'Visitor registration successful!') {
        await updateVisitorsCollection(); // Update the visitors collection in MongoDB
      }
      res.send(result);
    }
  } else {
    res.send("Unauthorized");
  }
});

app.get('/visitorinfo', verifyToken, async (req, res) => {
  try {
    // Connect to the MongoDB server
    await client.connect();

    if (req.user.role === 'admin' || req.user.role === 'security') {
      const visitorsCursor = client
        .db("MuseumVisitorSystem")
        .collection("visitors")
        .find();
      const visitors = await visitorsCursor.toArray();
      res.send(visitors);
    } else if (req.user.role === 'user') {
      const visitorsCursor = client
        .db("MuseumVisitorSystem")
        .collection("visitors")
        .find({ registeredBy: req.user.userProfile.name });
      const visitors = await visitorsCursor.toArray();
      res.send(visitors);
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    console.error('Error retrieving visitor information:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});


app.patch('/editvisitor/:id', verifyToken, async (req, res) => {
  const visitorId = req.params.id;
  const updateData = req.body;

  try {
    const visitorsCollection = client.db(dbName).collection(visitorsCollectionDB);

    if (!visitorId) {
      res.status(400).send('Invalid visitor ID');
      return;
    }

    const result = await visitorsCollection.findOneAndUpdate(
      { _id: new ObjectId(visitorId) },
      { $set: updateData },
      { returnOriginal: false }
    );

    if (!result.value) {
      res.status(404).send('Visitor not found');
    } else {
      await updateVisitorsCollection(); // Update the visitors collection in MongoDB
      res.send('Visitor info updated successfully');
    }
  } catch (error) {
    console.error('Error updating visitor info:', error);
    res.status(500).send('An error occurred while updating the visitor info');
  }
});

app.delete('/deletevisitor/:id', verifyToken, async (req, res) => {
  if (req.user.role === 'user') {
    const visitorId = req.params.id;

    try {
      const visitorsCollection = client.db(dbName).collection(visitorsCollectionDB);
      const result = await visitorsCollection.deleteOne({ _id: new ObjectId(visitorId) });

      if (result.deletedCount === 0) {
        res.status(404).send('Visitor not found');
      } else {
        await updateVisitorsCollection(); // Update the visitors collection in MongoDB
        res.send('Visitor deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting visitor:', error);
      res.status(500).send('An error occurred while deleting the visitor');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
});


app.post('/checkin', verifyToken, async (req, res) => {
  if (req.user.role !== 'security') {
    return res.status(401).send('Unauthorized');
  }

  const { visitorpass, carplate } = req.body;
  const visitor = dbVisitors.find(visitor => visitor.visitorpass === visitorpass);

  if (!visitor) {
    return res.status(404).send('Visitor not found');
  }

  const gmt8Time = moment().tz('GMT+8').format('YYYY-MM-DD HH:mm:ss');
  visitor.checkinTime = gmt8Time;
  visitor.carPlate = carplate;

  // Insert or update the check-in data in the RecordTime collection
  try {
    await visitingtime(visitorpass, visitor.visitorname, visitor.checkinTime);
    res.send(`Check-in recorded for visitor: ${visitor.visitorname}
      Check-in time: ${visitor.checkinTime}
      Car plate number: ${carplate}`);
  } catch (error) {
    console.error('Error inserting/updating RecordTime:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/checkout', verifyToken, async (req, res) => {
  if (req.user.role !== 'security') {
    return res.status(401).send('Unauthorized');
  }

  const { visitorpass } = req.body;
  const visitor = dbVisitors.find(visitor => visitor.visitorpass === visitorpass);

  if (!visitor) {
    return res.status(404).send('Visitor not found');
  }

  if (!visitor.checkinTime) {
    return res.send('Visitor has not checked in');
  }

  const gmt8Time = moment().tz('GMT+8').format('YYYY-MM-DD HH:mm:ss');
  const checkinTime = moment(visitor.checkinTime, 'YYYY-MM-DD HH:mm:ss');
  const checkoutTime = moment(gmt8Time, 'YYYY-MM-DD HH:mm:ss');
  visitor.checkoutTime = gmt8Time;

  // Update the check-out time in the RecordTime collection
  try {
    await visitingtime(visitorpass, visitor.visitorname, visitor.checkinTime, visitor.checkoutTime);
    res.send(`Checkout recorded for visitor: ${visitor.visitorname}
      Checkout time: ${visitor.checkoutTime}`);
  } catch (error) {
    console.error('Error inserting/updating RecordTime:', error);
    res.status(500).send('Internal Server Error');
  }
});

function login(loginuser, loginpassword) {
  console.log("Someone is logging in!", loginuser, loginpassword); // Display mesage
  const user = dbUsers.find(user => user.username === loginuser && user.password === loginpassword);
  if (user) {
    return user;
  } else {
    return { error: "User not found" };
  }
}


function register(newusername, newpassword, newname, newemail,newrole) {
  let match = dbUsers.find(element => element.username === newusername);
  if (match) {
    return "Error! Username is already taken.";
  } else  {
    const newUser = {
      username: newusername,
      password: newpassword,
      name: newname,
      email: newemail,
      role: newrole
    };
    dbUsers.push(newUser);
    return {
      status: "Registration successful!",
      user: newUser
    };
  }
}

function addvisitor(name, id, visitorpass, phoneNumber, email, appointmentDate, carPlate, purpose, destination
  , registeredBy) {
  // Check if the visitor with the same ID already exists
  let match = dbVisitors.find(element => element.idnumber === id);
  if (match) {
    return "Error! Visitor data already in the system.";
  } else {
    // Check if the visitorpass meets the required format
    const passRegex = new RegExp(`^${name}\\d{4}$`);
    if (!passRegex.test(visitorpass)) {
      return "Error! Invalid visitorpass. It should be a combination of 'visitorname' and 4 numbers.";
    }

    dbVisitors.push({
      visitorname: name,
      visitorpass: visitorpass,
      idnumber: id,
      phoneNumber: phoneNumber,
      email: email,
      date: appointmentDate,
      carPlate: carPlate,
      purpose: purpose,
      destination: destination,
      registerBy: registeredBy
    });
    return "Visitor registration successful!";
  }
}

async function updateUsersCollection() {
  try {
    const usersCollection = client.db(dbName).collection(usersCollectionDB);

    for (const user of dbUsers) {
      const existingUser = await usersCollection.findOne({ _id: user._id });

      if (existingUser) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: user },
          { upsert: true }
        );
      } else {
        user._id = new ObjectId(); // Generate a new ObjectId
        await usersCollection.insertOne(user);
      }
    }

    console.log('Users collection updated successfully');
  } catch (error) {
    console.error('Error updating users collection:', error);
  }
}
async function updateVisitorsCollection() {
  try {
    const visitorsCollection = client.db(dbName).collection(visitorsCollectionDB);

    for (const visitor of dbVisitors) {
      const existingVisitor = await visitorsCollection.findOne({ _id: visitor._id });

      if (existingVisitor) {
        await visitorsCollection.updateOne(
          { _id: visitor._id },
          { $set: visitor },
          { upsert: true }
        );
      } else {
        visitor._id = new ObjectId(); // Generate a new ObjectId
        await visitorsCollection.insertOne(visitor);
      }
    }

    console.log('Visitors collection updated successfully');
  } catch (error) {
    console.error('Error updating visitors collection:', error);
  }
}

async function visitingtime(visitorPass, visitorName, checkinTime, checkoutTime) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const RecordCollectionDB = db.collection('RecordTime');
    // Check if the visitor record already exists
    const existingRecord = await RecordCollectionDB.findOne({ visitorpass: visitorPass });

    if (existingRecord) {
      // Update the existing record with the visitor name and checkout time
      await RecordCollectionDB.updateOne(
        { visitorpass: visitorPass },
        { $set: { visitorName: visitorName, checkoutTime: checkoutTime } }
      );
      console.log('RecordTime updated successfully');
    } else {
      // Create a new document for the visitor
      const document = {
        visitorpass: visitorPass,
        visitorName: visitorName,
        checkinTime: checkinTime,
        checkoutTime: checkoutTime
      };
      // Insert the document
      await RecordCollectionDB.insertOne(document);
      console.log('RecordTime inserted successfully');
    }
    // Close the connection
    client.close();
  } catch (error) {
    console.error('Error inserting/updating RecordTime:', error);
  }
}

function generateToken(userProfile, role) {
  const payload = {
    userProfile,
    role
  };
  return jwt.sign(payload, 'access_token', 
  { expiresIn: 30 * 60 });
}

function verifyToken(req, res, next) {
  let header = req.headers.authorization;
  let token = header.split(' ')[1];

  jwt.verify(token, 'access_token', function (err, decoded) {
    if (err) {
      res.send("Invalid Token");
    } else {
      req.user = decoded;
      next();
    }
  });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});