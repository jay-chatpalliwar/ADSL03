const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 5000;

// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: '21510018',
  password: 'jay2003',
  database: 'dbs',
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Register a user (instructor, student, advisor)
app.post('/register', (req, res) => {
  const user = req.body.user;

  switch (user.role) {
    case 'instructor':
      registerInstructor(user, res);
      break;
    case 'student':
      registerStudent(user, res);
      break;
    case 'advisor':
      registerAdvisor(user, res);
      break;
    default:
      res.status(400).json({ error: 'Invalid role' });
  }
});

// Query data based on role (instructor or advisor)
app.post('/query/:role', (req, res) => {
  const role = req.params.role;
  const userid = req.query.userid;

  switch (role) {
    case 'instructor':
      queryInstructorData(userid, res);
      break;
    case 'advisor':
      queryAdvisorData(userid, res);
      break;
    default:
      res.status(400).json({ error: 'Invalid role' });
  }
});

app.post('/login/student', (req, res) => {
  const { id } = req.body;

  const query = 'SELECT * FROM student WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error during login', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
});

app.post('/login/instructor', (req, res) => {
  const { id } = req.body;

  const query = 'SELECT * FROM instructor WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error during login', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
});

app.post('/login/advisor', (req, res) => {
  const { id } = req.body;

  const query = 'SELECT * FROM advisor WHERE i_id = ? order by s_id';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error during login', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
});

app.post('/instructor/teaches', (req, res) => {
  const { id } = req.body;

  const query = 'SELECT * FROM teaches WHERE id = ? order by course_id';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error during login', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
});

app.post('/student/takes', (req, res) => {
  const { id } = req.body;

  const query = 'SELECT * FROM takes WHERE id = ? order by course_id';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error during login', error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  });
});

// Helper functions for registration
function registerInstructor(instructor, res) {
  const { id, name, dept_name, salary } = instructor;

  // Insert into 'instructor' table
  db.query(
    'INSERT INTO instructor (id, name, dept_name, salary) VALUES (?, ?, ?, ?)',
    [id, name, dept_name, salary],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering instructor' });
      } else {
        res.status(200).json({ message: 'Instructor registered successfully' });
      }
    }
  );
}

function registerStudent(student, res) {
  const { id, name, dept_name, tot_cred } = student;

  // Insert into 'student' table
  db.query(
    'INSERT INTO student (id, name, dept_name, tot_cred) VALUES (?, ?, ?, ?)',
    [id, name, dept_name, tot_cred],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering student' });
      } else {
        res.status(200).json({ message: 'Student registered successfully' });
      }
    }
  );
}

function registerAdvisor(advisor, res) {
  const { s_id, i_id } = advisor;

  // Insert into 'advisor' table
  db.query(
    'INSERT INTO advisor (s_id, i_id) VALUES (?, ?)',
    [s_id, i_id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error registering advisor' });
      } else {
        res.status(200).json({ message: 'Advisor registered successfully' });
      }
    }
  );
}

// Helper functions for querying data
function queryInstructorData(instructorid, res) {
  // Implement logic to query data for the instructor based on their id
  // Use SELECT statements with JOINs to retrieve related information
  db.query(
    'SELECT * FROM instructor WHERE id = ?',
    [instructorid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error querying data for instructor' });
      } else {
        res.status(200).json({ data: results });
      }
    }
  );
}

function queryAdvisorData(advisorid, res) {
  // Implement logic to query data for the advisor based on their id
  // Use SELECT statements with JOINs to retrieve related information
  db.query(
    'SELECT * FROM advisor WHERE s_id = ?',
    [advisorid],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error querying data for advisor' });
      } else {
        res.status(200).json({ data: results });
      }
    }
  );
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
