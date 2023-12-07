const express = require('express');
const app = express();
const mongoose = require('mongoose')
const userModel = require('./models/users.js')
const maintenanceRequestModel = require('./models/maintenanceRequests')
const adminModel = require('./models/admin.js')
const maintenanceModel = require('./models/maintenance.js')


const cors = require('cors')
const bodyParser = require('body-parser');
const db = require('./models/users.js');
const Role = db.role;

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(cors());
//app.use(bodyParser.json());




/*import {userRouter} from './middlewares/users.js'
app.use("/auth", userRouter)*/


mongoose.connect("mongodb+srv://ogg5015:Password123!!!@cluster0.uo0hphf.mongodb.net/maintenanceRequestDB?retryWrites=true&w=majority")



app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const user = await maintenanceModel.findOne({ email })


  if (user) {
    return res.json({ message: 'This user already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new maintenanceModel({ email, password: hashedPassword })
  await newUser.save()

  res.json({ message: 'User registered successfully' });
})


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User doesn't exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');

    if (!isPasswordValid) {
      return res.json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token, userID: user._id });
  } catch (error) {
    console.error("Error during login:", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});



app.post("/loginAdmin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await adminModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User doesn't exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');

    if (!isPasswordValid) {
      return res.json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token, userID: user._id });
  } catch (error) {
    console.error("Error during login:", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/loginMaintenance", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await maintenanceModel.findOne({ email });

    if (!user) {
      return res.json({ message: "User doesn't exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');

    if (!isPasswordValid) {
      return res.json({ message: "Username or password is incorrect" });
    }

    const token = jwt.sign({ id: user._id }, "secret");

    res.json({ token, userID: user._id });
  } catch (error) {
    console.error("Error during login:", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  });
};

app.get("/getUserType", authenticateToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const usertype = user.usertype;

    res.json({ usertype });
  } catch (err) {
    console.error('Error fetching usertype:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.get("/getUsers", async (req, res) => {
  try {
    const result = await userModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});



app.post('/createTenant', async (req, res) => {
  const tenantData = req.body;

  try {
    const hashedPassword = await bcrypt.hash(tenantData.password, 10);
    const newTenant = new userModel({
      name: tenantData.name,
      email: tenantData.email,
      password: hashedPassword,
      phonenumber: tenantData.phonenumber,
      apartmentnumber: tenantData.apartmentnumber,
      checkindate: tenantData.checkindate,
      checkoutdate: tenantData.checkoutdate
    });

    await newTenant.save();

    res.json({ success: true, message: 'Tenant created successfully.' });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get("/getMaintenanceRequests", async (req, res) => {
  try {
    const result = await maintenanceRequestModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});


app.get('/getMaintenanceRequestsByUserid/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const result = await maintenanceRequestModel.find({ userid: userID });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Maintenance requests not found for the specified apartment number' });
    }
  } catch (err) {
    console.error('Error fetching maintenance requests by apartment number:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.get('/getMaintenanceRequestsByArea/:area', async (req, res) => {
  const { area } = req.params;

  try {
    const result = await maintenanceRequestModel.find({ area: area });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Maintenance requests not found for the specified area' });
    }
  } catch (err) {
    console.error('Error fetching maintenance requests by area:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getMaintenanceRequestsByDateRange/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params;

  try {
    const result = await maintenanceRequestModel.find({
      datetime: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Maintenance requests not found for the specified date range' });
    }
  } catch (err) {
    console.error('Error fetching maintenance requests by date range:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getMaintenanceRequestsByStatus/:status', async (req, res) => {
  const { status } = req.params;

  try {
    const result = await maintenanceRequestModel.find({ status: status });
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Maintenance requests not found for the specified status' });
    }
  } catch (err) {
    console.error('Error fetching maintenance requests by status:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/createMaintenanceRequest", async (req, res) => {
  const maintenanceRequest = req.body
  const newMaintenanceRequest = new maintenanceRequestModel(maintenanceRequest);
  await newMaintenanceRequest.save();

  res.json(maintenanceRequest);
})

app.put('/updateMaintenanceRequestStatus/:id', async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  try {
    const result = await maintenanceRequestModel.findByIdAndUpdate(
      requestId,
      { $set: { status } },
      { new: true }
    );

    if (result) {
      res.json({ success: true, message: 'Maintenance request status updated successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Maintenance request not found.' });
    }
  } catch (error) {
    console.error('Error updating maintenance request status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "user not found" })
    }
    res.send("user deleted")
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" })
  }
})

app.get('/checkApartmentOccupied/:apartmentnumber', async (req, res) => {
  const { apartmentnumber } = req.params;

  try {
    const existingTenant = await userModel.findOne({ apartmentnumber });

    if (existingTenant) {
      res.json({ occupied: true });
    } else {
      res.json({ occupied: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: {error} });
  }
});

app.put('/updateUser/:id', async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  try {
      const result = await userModel.findByIdAndUpdate(userId, updatedUser, { new: true });
      if (result) {
          res.json({ success: true, message: 'User updated successfully.' });
      } else {
          res.status(404).json({ success: false, message: 'User not found.' });
      }
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.listen(3001, () => {
  console.log("Server Runs")
})