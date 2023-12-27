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
 *     summary: "User Login"
 *     description: "Authenticate a user and return user information."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: "User's username"
 *               Password:
 *                 type: string
 *                 description: "User's password"
 *     responses:
 *       200:
 *         description: "User authenticated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: "User information"
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
 *       401:
 *         description: "Unauthorized - Invalid username or password"
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
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: "User Registration"
 *     description: "Register a new user."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Username:
 *                 type: string
 *                 description: "User's username"
 *               Password:
 *                 type: string
 *                 description: "User's password"
 *               Name:
 *                 type: string
 *                 description: "User's name"
 *               Email:
 *                 type: string
 *                 format: email
 *                 description: "User's email address"
 *     responses:
 *       200:
 *         description: "User registered successfully"
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
 * /addvisitors:
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
 *               visitorpass:
 *                 type: string
 *                 description: "Visitor's pass"
 *               phoneNo:
 *                 type: string
 *                 description: "Visitor's phone number"
 *               carplate:
 *                 type: string
 *                 description: "Visitor's vehicle number"
 *               _Id:
 *                 type: string
 *                 description: "ID of the host"
 *               visitDate:
 *                 type: string
 *                 format: date
 *                 description: "Date of the visit"
 *               place:
 *                 type: string
 *                 description: "Visit place"
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
 * /editvisit/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: "Edit Visitor Information"
 *     description: "Update an existing visit record by visit name."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: "ID of the visitor to be edited"
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: "Visit detail ID"
 *               visitorName:
 *                 type: string
 *                 description: "Visitor's name"
 *               visitorpass:
 *                 type: string
 *                 description: "Visitor's pass"
 *               phoneNo:
 *                 type: string
 *                 description: "Visitor's phone number"
 *               carPlate:
 *                 type: string
 *                 description: "Visitor's vehicle number"
 *               email:
 *                 type: string
 *                 description: "Visitor's email"
 *               appointmentDate:
 *                 type: string
 *                 format: date
 *                 description: "Date of the visit"
 *               place:
 *                 type: string
 *                 description: "Visit place"
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
 * /delete-visit/{Id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: "Delete a Visit"
 *     description: "Delete a visit detail by visit detail ID. Only accessible to admins."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: Id
 *         in: path
 *         description: "ID of the visit detail to delete"
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "Visit detail deleted successfully"
 *       404:
 *         description: "Visit detail not found"
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
 *       - Admin
 *     summary: "Get Visitor Information"
 *     description: "Retrieve a list of visit details. Only accessible to admins."
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
 *                   visitorpass:
 *                     type: string
 *                     description: "Visitor's pass"
 *                   phoneNo:
 *                     type: string
 *                     description: "Visitor's phone number"
 *                   carPlate:
 *                     type: string
 *                     description: "Visitor's vehicle number"
 *                   email:
 *                     type: string
 *                     description: "Visitor's email"
 *                   appointmentDate:
 *                     type: string
 *                     format: date
 *                     description: "Date of the visit"
 *                   place:
 *                     type: string
 *                     description: "Visit place"
 *                   purpose:
 *                     type: string
 *                     description: "Purpose of the visit"
 *                   registeredBy:
 *                     type: "string"
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
