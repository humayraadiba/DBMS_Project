require('dotenv').config();
const bcrypt = require('bcrypt');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db');

const app = express();
app.use(bodyParser.json());
// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// app.use(express.static('E:/DBMS Project'));




// Your existing routes go here...

// Routes
app.get('/api/getUsers',
    async (req, res, next) => {
        try {
            const [rows] = await db.query('SELECT * FROM users');
            res.status(200).json(rows);
        } catch (err) {
            next(err);
        }
    }
)
//API Route for signup
const jwt = require('jsonwebtoken');

app.post('/api/signup', async (req, res, next) => {
    console.log("kaj korche");
    const { name, email, password, role } = req.body;
    
    try {

         // Log the incoming request
         console.log('Received signup request:', req.body);

         // Validate role
        if (!['Admin', 'General User'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role value' });
        }

        // Hash the password before saving
        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = 'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [name, email, hashedPassword, role]);

        // Generate token and return user ID
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User signed up successfully', token, userId: result.insertId });
    } catch (err) {
        next(err);
    }
});


// API Route for Login 

app.post('/api/login', async (req, res, next) => {
    const { username, password } = req.body;

    // console.log("backend e call asche");
    console.log(req.body)
    // console.log(username+ ' ' +  password);

    try {
        const query = 'SELECT * FROM Users WHERE name = ?';
        const [rows] = await db.query(query, [username]);
        // console.log(rows)

        if (rows.length > 0 && bcrypt.compareSync(password, rows[0].password)) {
             // Update lastlogin timestamp
             const updateQuery = 'UPDATE Users SET lastlogin = NOW() WHERE id = ?';
             await db.query(updateQuery, [rows[0].id]);

            const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '12h' });
            res.status(200).json({ message: 'Login successful', token, userId: rows[0].id });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        next(err);
    }
});

// Get all contacts with emails and mobile numbers
// app.get('/api/contacts', async (req, res, next) => {
//     try {
//         const query = `
//             SELECT 
//                 c.id, c.name, c.category, c.description,
//                 e.address AS email,
//                 m.number AS mobile
//             FROM Contact c
//             LEFT JOIN Email e ON c.id = e.contact_id
//             LEFT JOIN Mobile m ON c.id = m.contact_id
//         `;
//         const [rows] = await db.query(query);
//         res.status(200).json(rows);
//     } catch (err) {
//         next(err);
//     }
// });



app.get('/api/contacts/:userId', async (req, res, next) => {
    const { userId } = req.params; // Extract userId from the URL

    try {
        const query = `
            SELECT 
                c.id, c.name, c.category, c.description,
                e.address AS email,
                m.number AS mobile
            FROM Contact c
            INNER JOIN manages mng ON c.id = mng.contact_id  -- Join with manages table
            LEFT JOIN Email e ON c.id = e.contact_id
            LEFT JOIN Mobile m ON c.id = m.contact_id
            WHERE mng.user_id = ?  -- Filter contacts by userId
        `;

        const [rows] = await db.query(query, [userId]); // Use userId to fetch user-specific contacts
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});





// Search contacts by name, category, or description
app.get('/api/contacts/search', async (req, res, next) => {
    const { query } = req.query;
    try {
        const searchQuery = `
            SELECT 
                c.id, c.name, c.category, c.description,
                e.address AS email,
                m.number AS mobile
            FROM Contact c
            LEFT JOIN Email e ON c.id = e.contact_id
            LEFT JOIN Mobile m ON c.id = m.contact_id
            WHERE c.name LIKE ? OR c.category LIKE ? OR c.description LIKE ?
        `;
        const [rows] = await db.query(searchQuery, [`%${query}%`, `%${query}%`, `%${query}%`]);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});
//Route for user dashboard
app.get('/api/user/:id/dashboard', async (req, res, next) => {
    const userId = req.params.id;

    try {
        const [user] = await db.query('SELECT * FROM Users WHERE id = ?', [userId]);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        next(err);
    }
});

// Add a new contact
app.post('/api/contacts', async (req, res, next) => {
    const { name, category, description, email, mobile, userId } = req.body;
    console.log('Contact data:', contact);

    try {
        // Insert into Contact table
        const result = await db.query('INSERT INTO Contact (name, category, description) VALUES (?, ?, ?)', [name, category, description]);

        const generatedId = result[0].insertId;
        // Insert into Email table
        await db.query('INSERT INTO Email (address, contact_id) VALUES (?, ?)', [email, generatedId]);
        
        // // Insert into Mobile table
        await db.query('INSERT INTO Mobile (number, contact_id) VALUES (?, ?)', [mobile, generatedId]);
        
        // // Insert into Manages table to link contact with user
        await db.query('INSERT INTO Manages (user_id, contact_id) VALUES (?, ?)', [userId, generatedId]);

        res.status(201).json({ message: 'Contact saved successfully' });
    } catch (err) {
        next(err);
    }
});


// Update a contact
app.put('/api/contacts/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, category, description, email, mobile } = req.body;

    // console.log(id)

    try {
        // Start transaction
        // await db.beginTransaction();

        // Validate contact existence
        const [contactExists] = await db.query('SELECT id FROM Contact WHERE id = ?', [id]);
        if (contactExists.length === 0) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // Update Contact
        await db.query('UPDATE Contact SET name = ?, category = ?, description = ? WHERE id = ?', [name, category, description, id]);

        // Update or Insert Email
        await db.query('INSERT INTO Email (address, contact_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE address = VALUES(address)', [email, id]);

        // Update or Insert Mobile
        await db.query('INSERT INTO Mobile (number, contact_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE number = VALUES(number)', [mobile, id]);

        // Commit transaction
        // await db.commit();

        res.status(200).json({ message: 'Contact updated successfully' });
    } catch (err) {
        // Rollback in case of error
        // await db.rollback();
        next(err);
    }
});


// Delete a contact
app.delete('/api/contacts/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM Email WHERE contact_id = ?', [id]);
        await db.query('DELETE FROM Mobile WHERE contact_id = ?', [id]);
        await db.query('DELETE FROM Manages WHERE contact_id = ?', [id]);
        await db.query('DELETE FROM Contact WHERE id = ?', [id]);

        res.status(200).json({ message: 'Contact and related data deleted successfully' });
    } catch (err) {
        next(err);
    }
});

// API Route for Admin Login

app.post('/api/admin/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT * FROM Users WHERE name = ?';
        const [rows] = await db.query(query, [username]);

        if (rows.length > 0) {
            const admin = rows[0];

            // Verify password
            const isPasswordValid = bcrypt.compareSync(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Check if the user has an admin role
            if (admin.role !== 'Admin') {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }

            // Generate JWT token for admin
            const token = jwt.sign(
                { id: admin.id, role: admin.role }, // Include user ID and role in token payload
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Login successful', token, admin: { id: admin.id, name: admin.name } });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        next(err);
    }
});

//For Admin Dashboard
// Get all users
app.get('/api/getUsers', async (req, res, next) => {
    try {
        const query = 'SELECT * FROM Users ORDER BY id';
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});


// Delete a user by ID
app.delete('/api/deleteUser/:id', async (req, res, next) => {
    const userId = req.params.id;
    console.log("Delete request received for user ID:", userId); // Debugging
    try {
        // Delete dependent records in the 'manages' table
        const deleteManagesQuery = 'DELETE FROM manages WHERE user_id = ?';
        await db.query(deleteManagesQuery, [userId]);

        const deleteUserQuery = 'DELETE FROM Users WHERE id = ?';
        await db.query(deleteUserQuery, [userId]);

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error("Error in delete route:", err); // Debugging
        next(err);
    }
});


// Search users by name
app.get('/api/searchUsers', async (req, res, next) => {
    const { name } = req.query;
    try {
        const query = 'SELECT * FROM Users WHERE name LIKE ? ORDER BY id';
        const [rows] = await db.query(query, [`%${name}%`]);

        res.status(200).json(rows);
    } catch (err) {
        next(err);
    }
});

// reset code sent via email

app.post('/send-reset-code', async (req, res) => {
    const { email } = req.body;

    // Configure nodemailer
    let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


    // Generate a reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000);

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is ${resetCode}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Reset code sent successfully');
    } catch (error) {
        res.status(500).send('Failed to send reset code');
    }
});




app.use('/',
    (req, res) => {
        res.status(200).json({ message: 'Yee!! My Backend Worked!!' });
    }
);


// Error Handling
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});