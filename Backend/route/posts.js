const express = require("express");
const Registerusers = require("../models/posts");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("/createprofile", checkAuth, (req, res, next) => {
  const userprofile = new Registerusers({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    city: req.body.city,
    contactnumber: req.body.contactnumber,
    creator: req.userData.userId,
  });
  userprofile
    .save()
    .then((createdUser) => {
      res.status(200).json({
        message: "User added successfully!",
        user: {
          id: createdUser._id,
          firstname: createdUser.firstname,
          lastname: createdUser.lastname,
          city: createdUser.city,
          contactnumber: createdUser.contactnumber,
          creator: req.userData._id,
        },
        status: 200,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Something went wrong!",
        status: 400,
      });
    });
});

// router.get('/getAllUser', (req, res, next) => {
//     Registerusers.find().then(user => {
//         res.status(200).json({
//             message: 'Users fetched successfully!',
//             user: user,
//             status: 200,
//         });
//     }).catch(err => {
//         return res.status(400).json({
//             message: 'Something went wrong!',
//             status: 400
//         });
//     });
// });

router.get("/getAllUser/:query?", async (req, res, next) => {
  try {
    const query = req.params.query || "";
    const users = await Registerusers.find({
      $or: [
        { firstname: new RegExp(query, "i") },
        { lastname: new RegExp(query, "i") },
        { city: new RegExp(query, "i") },
        { contactnumber: new RegExp(query, "i") },
      ],
    });

    res.status(200).json({
      message: "Users fetched successfully!",
      user: users,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong!",
      status: 500,
    });
  }
});

router.get("/user/:id", (req, res, next) => {
  Registerusers.findById({ _id: req.params.id })
    .then((user) => {
      if (user) {
        res.status(200).json({
          message: "User fetched successfully!",
          user: user,
          status: 200,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Something went wrong!",
        status: 400,
      });
    });
});

router.put("/update/:id", checkAuth, (req, res, next) => {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    city: req.body.city,
    contactnumber: req.body.contactnumber,
    creator: req.userData.creator,
  };
  Registerusers.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    user,
  )
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({
          message: "User updated successfully",
          user: user,
          status: 200,
        });
      } else {
        res.status(401).json({
          message: "Not authorized!",
          status: 401,
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Something went wrong!",
        status: 400,
      });
    });
});

router.delete("/remove/:id", checkAuth, (req, res, next) => {
  Registerusers.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        return res.status(200).json({
          message: "User removed successfully!",
          status: 200,
        });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        message: "Something went wrong!",
        status: 400,
      });
    });
});

module.exports = router;
