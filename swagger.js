/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /Userlogin:
 *   post:
 *     tags:
 *       - User
 *     summary: User Login
 *     description: Authenticate a user and return user information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: User's username
 *               Password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: User information
 *       400:
 *         description: Bad Request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       401:
 *         description: Unauthorized - Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /Usersregister:
 *   post:
 *     tags:
 *       - User
 *     summary: User Registration
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: User's username
 *               Password:
 *                 type: string
 *                 description: User's password
 *               name:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Success message
 *       400:
 *         description: Bad Request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Error message
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /Addvisitor:
 *   post:
 *     tags:
 *       - Visitor
 *       - User
 *     summary: "Add Visitor"
 *     description: "Adding Visitors."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitorName:
 *                 type: string
 *                 description: "Visitor's name"
 *               gender:
 *                 type: string
 *                 description: "Visitor's gender"
 *               citizenship:
 *                 type: string
 *                 description: "Visitor's citizenship"
 *               visitorAddress:
 *                 type: string
 *                 description: "Visitor's address"
 *               phoneNo:
 *                 type: string
 *                 description: "Visitor's phone number"
 *               vehicleNo:
 *                 type: string
 *                 description: "Visitor's vehicle number"
 *               UserId:
 *                 type: string
 *                 description: "ID of the host user"
 *               visitDate:
 *                 type: string
 *                 format: date
 *                 description: "Date of the visit"
 *               purpose:
 *                 type: string
 *                 description: "Purpose of the visit"
 *     responses:
 *       200:
 *         description: "Visitor registration successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: "Success message"
 *       400:
 *         description: "Bad Request - Missing required fields"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /EditVisitor/{visitDetailId}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: "Edit Visitor Information"
 *     description: "Update an existing visit record by visit name."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: visitDetailId
 *         in: path
 *         description: "ID of the visit detail to be edited"
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitorName:
 *                 type: string
 *                 description: "Visitor's name"
 *               gender:
 *                 type: string
 *                 description: "Visitor's gender"
 *               citizenship:
 *                 type: string
 *                 description: "Visitor's citizenship"
 *               visitorAddress:
 *                 type: string
 *                 description: "Visitor's address"
 *               phoneNo:
 *                 type: string
 *                 description: "Visitor's phone number"
 *               vehicleNo:
 *                 type: string
 *                 description: "Visitor's vehicle number"
 *               UserId:
 *                 type: string
 *                 description: "ID of the host user"
 *               visitDate:
 *                 type: string
 *                 format: date
 *                 description: "Date of the visit"
 *               purpose:
 *                 type: string
 *                 description: "Purpose of the visit"
 *     responses:
 *       200:
 *         description: "Visit updated successfully"
 *       400:
 *         description: "Bad Request - No fields provided for update"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *       404:
 *         description: "Visit not found"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /deletevisitor/{visitDetailId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: "Delete a Visit"
 *     description: "Delete a visit detail by visit ID. Only accessible to admins."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: visitDetailId
 *         in: path
 *         description: "ID of the visit detail to delete"
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Visit detail deleted successfully"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /visitorinfo:
 *   get:
 *     tags:
 *       - Security
 *       - Admin
 *     summary: "Get Visitor Information"
 *     description: "Retrieve a list of visit details. Only accessible to security personnel."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "List of visit details retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: "Visit detail ID"
 *                   visitorName:
 *                     type: string
 *                     description: "Visitor's name"
 *                   gender:
 *                     type: string
 *                     description: "Visitor's gender"
 *                   citizenship:
 *                     type: string
 *                     description: "Visitor's citizenship"
 *                   visitorAddress:
 *                     type: string
 *                     description: "Visitor's address"
 *                   phoneNo:
 *                     type: string
 *                     description: "Visitor's phone number"
 *                   vehicleNo:
 *                     type: string
 *                     description: "Visitor's vehicle number"
 *                   UserId:
 *                     type: string
 *                     description: "ID of the host user"
 *                   visitDate:
 *                     type: string
 *                     format: date
 *                     description: "Date of the visit"
 *                   purpose:
 *                     type: string
 *                     description: "Purpose of the visit"
 *                   registeredBy:
 *                     type: string
 *                     description: "Username of the user who registered the visitor."
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /register-security:
 *   post:
 *     tags:
 *       - Security
 *     summary: "Register Security"
 *     description: "Register a new security personnel."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: "Security personnel's username"
 *               Password:
 *                 type: string
 *                 description: "Security personnel's password"
 *               name:
 *                 type: string
 *                 description: "Security personnel's name"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Security personnel's email address"
 *     responses:
 *       200:
 *         description: "Security personnel registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: "Success message"
 *       400:
 *         description: "Bad Request - Missing required fields"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /login-Security:
 *   post:
 *     tags:
 *       - Security
 *     summary: "Security Login"
 *     description: "Authenticate a security personnel and return a JWT token."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: "Security personnel's username"
 *               Password:
 *                 type: string
 *                 description: "Security personnel's password"
 *     responses:
 *       200:
 *         description: "Security personnel authenticated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: "JWT token"
 *       400:
 *         description: "Bad Request - Invalid username or password"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /register-admin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: "Register Admin"
 *     description: "Register a new admin user."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: "Admin user's username"
 *               Password:
 *                 type: string
 *                 description: "Admin user's password"
 *               name:
 *                 type: string
 *                 description: "Admin user's name"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Admin user's email address"
 *     responses:
 *       200:
 *         description: "Admin user registered successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: "Success message"
 *       400:
 *         description: "Bad Request - Missing required fields"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /login-Admin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: "Admin Login"
 *     description: "Authenticate an admin user and return a JWT token."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: "Admin user's username"
 *               Password:
 *                 type: string
 *                 description: "Admin user's password"
 *     responses:
 *       200:
 *         description: "Admin user authenticated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: "JWT token"
 *       400:
 *         description: "Bad Request - Invalid username or password"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: "Error message"
 */

/**
 * @swagger
 * /get-visitor-pass/{hostId}:
 *   get:
 *     tags:
 *       - Visitor
 *     summary: Retrieve the visitor pass for a host
 *     parameters:
 *       - in: path
 *         name: hostId
 *         required: true
 *         description: The ID of the host to retrieve the visitor pass for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the retrieved visitor pass
 *         content:
 *           application/json:
 *             example:
 *               visitorPass: ABC123
 *       400:
 *         description: Bad request, missing hostId
 *       404:
 *         description: Host not found
 *       500:
 *         description: Internal server error
 */