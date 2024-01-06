const { error } = require('console');
const express = require('express');
const app = express()
//const port = process.env.PORT || 4000;
const port = 4000

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

//Function Admin Register
async function registerAdmin(reqAdminUsername, reqAdminPassword, reqAdminName, reqAdminEmail) {
  const client = new MongoClient(uri);
  try {
    await client.connect();


    // Validate the request payload
    if (!reqAdminUsername || !reqAdminPassword || !reqAdminName || !reqAdminEmail) {
      throw new Error('Missing required fields');
    }

    await adminCollection.insertOne({
      Username: reqAdminUsername,
      Password: reqAdminPassword,
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
 
  //Function User Register
  async function Usersregister(reqUsername, reqPassword, reqName, reqEmail) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
 
 
      // Validate the request payload
      if (!reqUsername || !reqPassword || !reqName || !reqEmail ) {
        throw new Error('Missing required fields');
      }
 
      await usersCollection.insertOne({
        Username: reqUsername,
        Password: reqPassword,
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

     //Function Security Register
  async function registerSecurity(reqUsername, reqPassword, reqName, reqEmail) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
 
 
      // Validate the request payload
      if (!reqUsername || !reqPassword || !reqName || !reqEmail ) {
        throw new Error('Missing required fields');
      }
 
      await securityCollection.insertOne({
        Username: reqUsername,
        Password: reqPassword,
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
      const {visitorName, gender, citizenship, visitorAddress, phoneNo, vehicleNo, UserId, visitDate, purpose } = req.body;

      // Ensure all required fields are present
      if (!visitorName || !gender || !UserId || !visitDate || !purpose || !citizenship || !visitorAddress || !phoneNo || !vehicleNo) {
        throw new Error('Missing required fields');
      }

      const db = client.db('MuseumVisitorSystem');
      const visitDetailCollection = db.collection('visitorinfo');

      // Insert the visit data into the visitDetailCollection
      const visitData = {
        visitorName,
        gender,
        citizenship,
        visitorAddress,
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
  const { visitorName, gender, citizenship, visitorAddress, phoneNo, vehicleNo, UserId, visitDate, purpose } = req.body;

  if (!visitorName && !gender && !citizenship && !visitorAddress && !phoneNo && !vehicleNo && !UserId && !visitDate && !purpose) {
    res.status(400).send('No fields provided for update');
    return;
  }

  const updateData = {};

  if (visitorName) updateData.visitorName = visitorName;
  if (gender) updateData.gender = gender;
  if (citizenship) updateData.citizenship = citizenship;
  if (visitorAddress) updateData.visitorAddress = visitorAddress;
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
      
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});