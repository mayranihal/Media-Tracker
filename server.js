/*
 * This code is provided solely for the personal and private use of students
 * taking the CSC309H course at the University of Toronto. Copying for purposes
 * other than this use is expressly prohibited. All forms of distribution of
 * this code, including but not limited to public repositories on GitHub,
 * GitLab, Bitbucket, or any other online platform, whether as given or with
 * any changes, are expressly prohibited.
 */

/* E4 server.js */
"use strict";
const log = console.log;

// Express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const path = require("path");

// Mongo and Mongoose
const { ObjectID } = require("mongodb");
const { mongoose } = require("./src/db/mongoose");
const { User } = require("./src/models/user");

// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require("connect-mongo"); // to store session information on the database in production
const { eventNames } = require("process");

/////////////////////////////////////////////////////////////////////////////////////////////////////

// CITATION: from react express authentication repo
// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  if (req.session.userID) {
    User.findById(req.session.userID)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        res.status(401).send("Unauthorized");
      });
  } else {
    res.status(401).send("Unauthorized");
  }
};

/*** Session handling **************************************/
// Create a session and session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET || "our hardcoded secret", // make a SESSION_SECRET environment variable when deploying (for example, on heroku)
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: false,
      httpOnly: true,
    },
    // store the sessions on the database in production
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI || "mongodb://localhost:27017/MyListDatabase",
    }),
  })
);

// A route to login and create a session
app.post("/users/login", (req, res) => {
  const { username, password } = req.body;

  // log(email, password);
  // Use the static method on the User model to find a user
  // by their email and password
  User.findOne({ username: username, password: password })
    .then((user) => {
      // Add the user's id to the session.
      // We can check later if this exists to ensure we are logged in.
      req.session.userID = user._id;
      req.session.username = user.username; // we will later send the username to the browser when checking if someone is logged in through GET /check-session (we will display it on the frontend dashboard. You could however also just send a boolean flag).
      res.send({ currentUser: user });
    })
    .catch((error) => {
      res.status(400).send();
    });
});

// A route to logout a user
app.get("/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send();
    }
  });
});

// A route to check if a user is logged in on the session
app.get("/users/check-session", authenticate, (req, res) => {
  if (req.session.userID) {
    res.send({ currentUser: req.session.username });
  } else {
    res.status(401).send();
  }
});

//CITATION: MONGO DB abruptly disconnects during promise process helper from lecture of March 8:

function isMongoError(error) {
  // checks for first error returned by promise rejection if Mongo database suddently disconnects
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}
/////////////////////////////////////////////////////////////////////////////////////////////////////
// user API ROUTES

//POST route that makes a user
/* 
Request body expects:
{
	"username": <userName>
	"password": <passWord>
}
Returned JSON should be the database document added.
*/

app.post("/users", async (req, res) => {
  // Add code here

  //check connection for mongoose
  if (mongoose.connection.readyState != 1) {
    res.status(500).send("Internal server error");
    return;
  }

  //create new user
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
    userType: "user",
    data: {
      Movies: {
        completed: [],
        inprogress: [],
        interested: [],
      },
    },
  });

  //send created user or appropriate error
  try {
    res.send(await newUser.save());
  } catch (error) {
    //check if mongo server disconnect abruptly
    if (isMongoError(error)) {
      res.status(500).send("Internal server error");
    } else {
      //badd request
      res.status(400).send("Bad Request");
    }
  }
});

//GET route for user that you want to  login
app.get("/users/:username", async (req, res) => {
  //checking if ID valid ID of an existing user
  console.log("GET USER");
  const userWanted = req.params.username;
  // if (!ObjectID.isValid(userWanted)) {
  //   res.status(404).send("Resource not found");
  //   return;
  // }

  //check mongoose connection
  if (mongoose.connection.readyState != 1) {
    res.status(500).send("Internal Server Error");
    return;
  }
  try {
    //try to get user
    const usertoReturn = await User.findOne({ username: userWanted }).exec();
    //log(usertoReturn);
    if (usertoReturn) {
      res.send(usertoReturn);
    } else {
      res.status(404).send("Resource not found");
    }
  } catch (error) {
    //server error
    res.status(500).send("Internal Server Error");
  }
});

//DELETE route to remove user by ID -> only admin can do thissss
app.delete("/users/:username", authenticate, async (req, res) => {
  const username = req.params.username;

  //Check if connection exists to server
  if (mongoose.connection.readyState != 1) {
    res.status(500).send("Internal Server Error");
    return;
  }
  //try to delete the user
  try {
    //try to remove user
    const usertoDelete = await User.findOneAndDelete({ username: username });
    //console.log(usertoDelete);
    if (!usertoDelete) {
      res.status(404).send();
    } else {
      res.send(usertoDelete);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//POST route for adding a new  mediaData piece to a user
/**Request body expects:
{
	category, status, title, year, rating, icon, notes
}**/
app.post("/users/:username", authenticate, async (req, res) => {
  const userWanted = req.params.username;
  const { category, status, title, year, rating, icon, notes } = req.body;

  // check if status is valid
  if (!["completed", "inprogress", "interested"].includes(status)) {
    res.status(400).send("Invalid request");
    return;
  }

  //check server connection
  if (mongoose.connection.readyState != 1) {
    res.status(500).send("Internal Server Error: Due to Connection");
    return;
  }

  //newly made media data
  const newMediaData = {
    title: title,
    year: year,
    rating: rating,
    icon: icon,
    notes: notes == null ? "" : notes,
  };

  try {
    const userNeeded = await User.findOne({ username: userWanted });
    if (userNeeded) {
      const userMedia = userNeeded.data;

      // Add and initialize category if it doesn't exist
      if (!(category in userMedia)) {
        userMedia[category] = {
          completed: [],
          inprogress: [],
          interested: [],
        };
      }
      userMedia[category][status].unshift(newMediaData);
      userNeeded.markModified("data");
      const updateUserData = await userNeeded.save();

      //send the updated  user and the new data obj -> #####DECIDE IF SHOULD
      ///SEND BOTH OR NAH????
      res.send({ user: updateUserData, media: newMediaData });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//DELETE route for deleting a single mediaData for a user
//req body needs {status, index}
app.delete(
  "/users/media/:username/:category",
  authenticate,
  async (req, res) => {
    //check if user id and data id exist
    const { username, category } = req.params;
    const { status, index } = req.body;

    //Check if connection exists to server
    if (mongoose.connection.readyState != 1) {
      res.status(500).send("Internal Server Error");
      return;
    }

    // check if status is valid
    if (!["completed", "inprogress", "interested"].includes(status)) {
      res.status(400).send("Invalid request");
      return;
    }

    //try to delete  a single mediaData for a user
    try {
      const usertoAlter = await User.findOne({ username: username });

      if (usertoAlter) {
        if (!(category in usertoAlter.data)) {
          res.status(400).send("Invalid request: Category doesn't exist");
          return;
        }

        const mediaList = usertoAlter.data[category][status];

        if (index < 0 || index >= mediaList.length) {
          res.status(400).send("Invalid request: Index out of range");
          return;
        }

        const deletedMedia = mediaList[index];
        mediaList.splice(index, 1);
        usertoAlter.markModified("data");
        await usertoAlter.save();
        res.send({ media: deletedMedia, user: usertoAlter });
      } else {
        res.status(404).send("Resource not found");
      }

      //mongo server disconnects or ends up faulty somehow
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

//PATCH route to change a media

// body: {status: str, index: num, changes: {(like above)}}
app.patch(
  "/users/media/:username/:category",
  authenticate,
  async (req, res) => {
    const { username, category } = req.params;
    const { status, index, changes } = req.body;

    log("PATCH MEDIA");
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
      log("Issue with mongoose connection");
      res.status(500).send("Internal server error");
      return;
    }

    // check if status is valid
    if (!["completed", "inprogress", "interested"].includes(status)) {
      res.status(400).send("Invalid request");
      return;
    }

    // Update the user
    try {
      const user = await User.findOne({ username: username });
      if (user) {
        if (category in user.data) {
          const mediaList = user.data[category][status];

          // Check index in range
          if (index < 0 || index >= mediaList.length) {
            res.status(400).send("Bad request: index out of range");
            return;
          }

          const changedMedia = mediaList[index];

          Object.keys(changes).map((change) => {
            if (change in changedMedia) {
              changedMedia[change] = changes[change];
            } else {
              log(change + ": key doesn't exist");
            }
          });
        } else {
          log("Category doesnt exist");
          res.status(400).send("Bad request: category doesn't exist");
        }

        user.markModified("data");
        await user.save();

        res.send(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      log(error);
      if (isMongoError(error)) {
        res.status(500).send("Internal server error");
      } else {
        res.status(400).send("Bad Request");
      }
    }
  }
);

//PATCH route to change anything about a user
app.patch("/users/:username", authenticate, async (req, res) => {
  const username = req.params.username;

  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
    log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }

  // Update the user
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      Object.keys(req.body).map((change) => {
        if (change in user) {
          user[change] = req.body[change];
        } else {
          log(change + ": key doesn't exist");
        }
      });

      await user.save();

      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    log(error);
    if (isMongoError(error)) {
      res.status(500).send("Internal server error");
    } else {
      res.status(400).send("Bad Request");
    }
  }
});

//POST route for adding a new category
/**Request body expects:
{
	name

}**/
app.post("/users/:username/addCategory", authenticate, async (req, res) => {
  const userWanted = req.params.username;
  const { name } = req.body; //category name
  //console.log(req);
  console.log("name is " + name);

  if (mongoose.connection.readyState != 1) {
    res.status(500).send("Internal Server Error: Due to Connection");
    return;
  }

  const newCategory = {
    completed: [],
    inprogress: [],
    interested: [],
  };

  try {
    const userNeeded = await User.findOne({ username: userWanted });
    if (userNeeded) {
      const userMedia = userNeeded.data;

      // add new category
      if (!(name in userMedia)) {
        userMedia[name] = newCategory;
      }

      userNeeded.markModified("data");
      const updateUserData = await userNeeded.save();

      res.send({ user: updateUserData, media: newCategory });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//DELETE route for deleting a category
/**Request body expects:
{
	name

}**/
app.delete(
  "/users/:username/deleteCategory",
  authenticate,
  async (req, res) => {
    const userWanted = req.params.username;
    const { name } = req.body; //which category you're trying to delete
    //console.log(req);
    console.log("name is " + name);

    if (mongoose.connection.readyState != 1) {
      res.status(500).send("Internal Server Error");
      return;
    }

    //check if the user exists
    try {
      const deletingForUser = await User.findOne({ username: userWanted });
      //console.log("deletingForUser" + deletingForUser);

      //check if the category exists first
      if (deletingForUser) {
        if (!(name in deletingForUser.data)) {
          res.status(400).send("Invalid request: Category doesn't exist");
          return;
        }
        console.log("category to delete exists, it's " + name);

        delete deletingForUser.data[name];

        console.log("u deleted the name");
        deletingForUser.markModified("data");
        await deletingForUser.save();
        res.send({ user: deletingForUser });
        console.log("done delete category!!");
      } else {
        res.status(404).send("Resource not found");
      }

      //mongo server disconnects or ends up faulty somehow
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);

//PATCH route for changing category name
/**Request body expects:
{
	nameToChange, newName
}**/

app.patch("/users/:username/editCategory", authenticate, async (req, res) => {
  const editUsername = req.params.username;
  const { nameToChange, newName } = req.body;
  console.log("name is " + nameToChange);

  if (mongoose.connection.readyState != 1) {
    log("Issue with mongoose connection");
    res.status(500).send("Internal server error");
    return;
  }

  // update the category
  try {
    const user = await User.findOne({ username: editUsername });
    if (user) {
      //user we want exists
      if (nameToChange in user.data && !(newName in user.data)) {
        console.log("inside 2nd if");
        delete Object.assign(user.data, {
          [newName]: user.data[nameToChange],
        })[nameToChange];
      } else {
        res.status(400).send("Bad request: category doesn't exist");
      }
      user.markModified("data");
      await user.save();

      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send("Internal server error");
    } else {
      res.status(400).send("Bad Request");
    }
  }
});

// Setting up a static directory for the files in /pub
// using Express middleware.
// Don't put anything in /pub that you don't want the public to have access to!
app.use(express.static(path.join(__dirname, "/build")));

// CITATION: https://medium.com/@lowewenzel/serving-express-with-a-react-single-page-app-within-the-same-application-c168f1c44201
app.get(["/", "/*"], function (req, res, next) {
  res.sendFile(path.join(__dirname, "/build", "index.html"));
});
////////// DO NOT CHANGE THE CODE OR PORT NUMBER BELOW
const port = process.env.PORT || 5000;
app.listen(port, () => {
  log(`Listening on port ${port}...`);
});
