const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());

//routes
app.post("/create", async (req,res) => {
    const { name, email, password } = req.body;

    try {
        connection.query(
            "INSERT INTO users (full_name, email, user_password) VALUES (?, ?, ?)",
            [name, email, password],
            (err, results, fields) => {
                if (err) {
                    console.log("Error while inserting a user into the database,", err);
                    return res.status(400).send();
                }
                console.log("RESULTS", results);
                console.log("FIELDS: ", fields)
                return res
                .status(201)
                .json({message: "new user successfully created!"})
            }
        )
    } catch (error) {
        console.log(err);
        return res.status(500).send();
    }
})

//GET
//GET ALL
app.get("/read", async (req, res) => {
    try {
        connection.query("SELECT * FROM users", (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            res.status(200).json(results);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
})

//GET one
app.get("/read/single/:email", async (req, res) => {
    const email = req.params.email;

    try {
        connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            return res.status(200).json(results);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
});

//UPDATE
app.patch("/update/:email", async (req,res) => {
    const email = req.params.email;
    const newPassword = req.body.newPassword;

    try {
        connection.query(
            "UPDATE users SET user_password = ? WHERE email = ?",
            [newPassword, email],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                return res.status(200).json({message: 'user password updated successfully'});
            }
        )
    } catch (error) {
        console.log(err);
        return res.status(500).send();
    }
})

//DELETE
app.delete("/delete/:id", async(req, res) => {
    const id = req.params.id;

    try {
        connection.query(
            "DELETE FROM users WHERE id = ?",
            [id],
            (err,results, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({message: 'no user with that email'})
                }
                return res.status(200).json({message: 'user deleted succesffully!'});
            }
        )
    } catch (error) {
        console.log(error);
        return res.status(500).send();
        
    }
})

//MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'node_mysql_db'
})

//connecting to the db using the above credentials
connection.connect((err) => {
    if(err) {
        console.log('Error connecting to MySQL database = ', err);
        return;
    }
    console.log('MySQL successfully connected!')
})


app.listen(3000, () => {
    console.log("server running on PORT 3000...")
})