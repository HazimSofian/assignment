const { error } = require('console');
const express = require('express');
const app = express()
//const port = process.env.PORT || 4000;
const port = 4000

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const moment = require('moment-timezone');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Azraii_12:Kiri-12@cluster27.pgoifwj.mongodb.net/MuseumVisitorSystem";
const dbName = "MuseumVisitorSystem";

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Museum Visitor Managment System',
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
  
  client.connect().then(() => {
    console.log('Connected to MongoDB');
    const db = client.db('MuseumVisitorSystem');
    adminCollection = db.collection('admin');
    visitDetailCollection = db.collection('visitorinfo');
    securityCollection = db.collection('security');
    usersCollection = db.collection('users');
  

    ////Function User Login
  async function Userlogin(reqUsername, reqPassword) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
  
      // Validate the request payload
      if (!reqUsername || !reqPassword) {
        throw new Error('Missing required fields');
      }
  
      let matchuser = await usersCollection.findOne({ Username: reqUsername });
  
      if (!matchuser) {
        throw new Error('User not found!');
      }
      if (matchuser.Password === reqPassword) {
        return {
          user: matchuser,
        };
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
      console.error('Login Error:', error);
      throw new Error('An error occurred during login.');
    } finally {
      await client.close();
    }
  }

// Function Admin Register
async function registerAdmin(reqAdminUsername, reqAdminPassword, reqAdminName, reqAdminEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // Validate the request payload
    if (!reqAdminUsername || !reqAdminPassword || !reqAdminName || !reqAdminEmail) {
      throw new Error('Missing required fields');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(reqAdminPassword, 10);

    await adminCollection.insertOne({
      Username: reqAdminUsername,
      Password: hashedPassword,
      name: reqAdminName,
      email: reqAdminEmail,
    });

    return 'Registration Complete!!';
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('An error occurred during registration.');
  } finally {
    await client.close();
  }
}

  //Function Admin Login
  async function Adminlogin(reqAdminUsername, reqAdminPassword) {
   const client = new MongoClient(uri);
   try {
     await client.connect();

     // Validate the request payload
     if (!reqAdminUsername || !reqAdminPassword) {
       throw new Error('Missing required fields');
     }
     let matchuser = await adminCollection.findOne({ Username: reqAdminUsername });

     if (!matchuser) {
       throw new Error('User not found!');
     }
     if (matchuser.Password === reqAdminPassword) {
       const token = generateToken(matchuser);
       return {
        user: matchuser,
        token: token,
       };
     } else {
       throw new Error('Invalid password');
     }
   } catch (error) {
     console.error('Login Error:', error);
     throw new Error('An error occurred during login.');
   } finally {
     await client.close();
   }
  }

   //Function Security Login
   async function Securitylogin(reqSecurityUsername, reqSecurityPassword) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
 
      // Validate the request payload
      if (!reqSecurityUsername || !reqSecurityPassword) {
        throw new Error('Missing required fields');
      }
      let matchuser = await securityCollection.findOne({ Username: reqSecurityUsername });
 
      if (!matchuser) {
        throw new Error('User not found!');
      }
      if (matchuser.Password === reqSecurityPassword) {
        const token = generateToken(matchuser);
        return {
         user: matchuser,
         token: token,
        };
      } else {
        throw new Error('Invalid password');
      }
    } catch (error) {
      console.error('Login Error:', error);
      throw new Error('An error occurred during login.');
    } finally {
      await client.close();
    }
   }
 
 // Function Users register
async function Usersregister(reqUsername, reqPassword, reqName, reqEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // Validate the request payload
    if (!reqUsername || !reqPassword || !reqName || !reqEmail) {
      throw new Error('Missing required fields');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(reqPassword, 10);

    await usersCollection.insertOne({
      Username: reqUsername,
      Password: hashedPassword,
      name: reqName,
      email: reqEmail,
    });

    return 'Registration Complete!!';
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('An error occurred during registration.');
  } finally {
    await client.close();
  }
}


// Function Security Register
async function registerSecurity(reqUsername, reqPassword, reqName, reqEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();

    // Validate the request payload
    if (!reqUsername || !reqPassword || !reqName || !reqEmail) {
      throw new Error('Missing required fields');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(reqPassword, 10);

    await securityCollection.insertOne({
      Username: reqUsername,
      Password: hashedPassword,
      name: reqName,
      email: reqEmail,
    });

    return 'Registration Complete!!';
  } catch (error) {
    console.error('Registration Error:', error);
    throw new Error('An error occurred during registration.');
  } finally {
    await client.close();
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
      await client.close();
    } catch (error) {
      console.error('Error inserting/updating RecordTime:', error);
    }
  }

  //Function Generate Token
  function generateToken(user) {
    const payload = 
    {
      username: user.AdminUsername,
    };
    const token = jwt.sign
    (
      payload, 'password', 
      { expiresIn: '1h' }
    );
    return token;
  }
  
  //Function Verify
  function verifyToken(req, res, next) {
    let header = req.headers.authorization;
    console.log(header);
  
    let token = header.split(' ')[1];
  
    jwt.verify(token, 'password', function (err, decoded) {
      if (err) {
        return res.status(401).send('Invalid Token');
      }
  
      req.user = decoded;
      next();
    });
  }
  
  // Express setup
  app.use(express.json());

  //Login User
  app.post('/Userlogin', (req, res) => {
    console.log(req.body);
  
    Userlogin(req.body.Username, req.body.Password)
      .then((result) => {
        res.json(result.user); // Return user information without generating a token
      })
      .catch((error) => {
        res.status(400).send(error.message);
      });
  });
  
  //Register User
  app.post('/Usersregister', (req, res) => {
    console.log(req.body);

    Usersregister(req.body.Username, req.body.Password, req.body.name, req.body.email)
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
      res.status(400).send(error.message);
      });
  });

  app.post('/Addvisitor', async (req, res) => {
    try {
      const {visitorName, gender, citizenship, visitorpass, phoneNo, vehicleNo, UserId, visitDate, purpose } = req.body;

      // Ensure all required fields are present
      if (!visitorName || !gender || !UserId || !visitDate || !purpose || !citizenship || !visitorpass || !phoneNo || !vehicleNo) {
        throw new Error('Missing required fields');
      }

      const db = client.db('MuseumVisitorSystem');
      const visitDetailCollection = db.collection('visitorinfo');

      // Insert the visit data into the visitDetailCollection
      const visitData = {
        visitorName,
        visitorpass,
        gender,
        citizenship,
        phoneNo,
        vehicleNo,
        UserId,
        visitDate,
        purpose
      };
      await visitDetailCollection.insertOne(visitData);

      res.send('Visit created successfully');
    } catch (error) {
      console.error('Error creating visit:', error);
      res.status(500).send('An error occurred while creating the visit');
    }
  });

// Update visitor (only admin)
app.patch('/EditVisitor/:visitDetailId', verifyToken, (req, res) => {
  const visitDetailId = req.params.visitDetailId;
  const { visitorName, gender, citizenship, visitorpass, phoneNo, vehicleNo, UserId, visitDate, purpose } = req.body;

  if (!visitorName && !gender && !citizenship && !visitorpass && !phoneNo && !vehicleNo && !UserId && !visitDate && !purpose) {
    res.status(400).send('No fields provided for update');
    return;
  }

  const updateData = {};

  if (visitorName) updateData.visitorName = visitorName;
  if (visitorpass) updateData.visitorpass = visitorpass;
  if (gender) updateData.gender = gender;
  if (citizenship) updateData.citizenship = citizenship;
  if (phoneNo) updateData.phoneNo = phoneNo;  // Fix the typo in property name
  if (vehicleNo) updateData.vehicleNo = vehicleNo;  // Fix the typo in property name
  if (UserId) updateData.UserId = UserId;
  if (visitDate) updateData.visitDate = visitDate;
  if (purpose) updateData.purpose = purpose;

  visitDetailCollection
    .findOneAndUpdate({ _id: new ObjectId(visitDetailId) }, { $set: updateData })
    .then((result) => {
      if (!result.value) {
        // No matching document found
        throw new Error('Visit not found');
      }
      res.send('Visit updated successfully');
    })
    .catch((error) => {
      console.error('Error updating visit:', error);
      if (error.message === 'Visit not found') {
        res.status(404).send('Visit not found');
      } else {
        res.status(500).send('An error occurred while updating the visit');
      }
    });
});

  // Delete visit (only admin)
  app.delete('/deletevisitor/:visitDetailId',verifyToken, (req, res) => {
    const visitDetailId = req.params.visitDetailId;
  
    visitDetailCollection
      .deleteOne({ _id: new ObjectId(visitDetailId) })
      .then(() => {
        res.send('Visit detail deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting visit detail:', error);
        res.status(500).send('An error occurred while deleting the visit detail');
      });
  });
  
  // Read visit details (only Security)  
  app.get('/visitorinfo',verifyToken, (req, res) => {
    visitDetailCollection
      .find({})
      .toArray()
      .then((visitDetails) => {
        res.json(visitDetails);
      })
      .catch((error) => {
        console.error('Error retrieving visit details:', error);
        res.status(500).send('An error occurred while retrieving visit details');
      });
  });

  //Register Security
  app.post('/register-security', (req, res) => {
    console.log(req.body);
      
      registerSecurity(req.body.Username, req.body.Password, req.body.name, req.body.email)
          .then((result) => {
            res.send(result);
        })
        .catch((error) => {
          res.status(400).send(error.message);
        });
  });
    
      //Login Security
      app.post('/login-Security', (req, res) => {
        console.log(req.body);
      
        Securitylogin(req.body.Username, req.body.Password)
          .then((result) => {
            let token = generateToken(result);
            res.send(token);
          })
          .catch((error) => {
            res.status(400).send(error.message);
          });
      });

//Register Admin
app.post('/register-admin', (req, res) => {
  console.log(req.body);

  registerAdmin(req.body.Username, req.body.Password, req.body.name, req.body.email)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

      //Login Admin
       app.post('/login-Admin', (req, res) => {
          console.log(req.body);
  
         Adminlogin(req.body.Username, req.body.Password)
         .then((result) => {
           let token = generateToken(result);
           res.send(token);
         })
         .catch((error) => {
           res.status(400).send(error.message);
         });
      });

  // Check-In (Visitor)
app.post('/checkin', verifyToken, async (req, res) => {

  const { visitorpass, vehicleNo, visitorName } = req.body;
  const visitor = visitDetailCollection.find(visitor => visitor.visitorpass === visitorpass);

  if (!visitorpass || !vehicleNo || !visitorName) {
    return res.status(404).send('Visitor not found');
  }

  const gmt8Time = moment().tz('GMT+8').format('YYYY-MM-DD HH:mm:ss');
  visitor.checkinTime = gmt8Time;
  visitor.vehicleNo= vehicleNo;

  // Insert or update the check-in data in the RecordTime collection
  try {
    await visitingtime(visitorpass, visitorName, visitor.checkinTime);
    res.send(`Check-in recorded for visitor: ${visitorName}
      Check-in time: ${visitor.checkinTime}
      Car plate number: ${vehicleNo}`);
  } catch (error) {
    console.error('Error inserting/updating RecordTime:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Check-Out (Visitor)
app.post('/checkout', verifyToken, async (req, res) => {
  const { visitorpass, vehicleNo, visitorName } = req.body;

  const visitor = await visitDetailCollection.findOne({ visitorpass: visitorpass });

  if (!visitor) {
    return res.status(404).send('Visitor not found');
  }

  const gmt8Time = moment().tz('GMT+8').format('YYYY-MM-DD HH:mm:ss');

  // Update the visitor's check-out details
  await visitDetailCollection.updateOne(
    { visitorpass: visitorpass },
    { $set: { checkoutTime: gmt8Time } }
  );

  // Update the check-out time in the RecordTime collection
  try {
    await visitingtime(visitorpass, visitorName, visitor.checkinTime, gmt8Time);
    res.send(`Checkout recorded for visitor: ${visitorName}\nCheckout time: ${gmt8Time}`);
  } catch (error) {
    console.error('Error recording checkout:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
      
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});