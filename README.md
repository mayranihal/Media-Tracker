# Team 17: Media Tracker

https://team17-mylist.herokuapp.com/user

Media Tracker is a website where users can keep track of the media they consume.


## Login credentials
* User account
  * Username: user
  * Password: user
* Admin account
  * Username: admin
  * Password: admin


## Build instructions
```
>npm i
>mkdir mongo-data
>mongod --dbpath mongo-data
>npm run build
>npm start
```

## Instructions for users

Upon registering and logging in, users are given **categories** and **status tabs**. Categories can be anything the user specifies, but there are three specific status tabs: Completed, In Progress, and Incomplete. They can add media to each status tab in each category. They can then edit, delete, or move that media to a different tab. They can add, rename, and delete categories as well.

On their profile card, they can change their profile picture, username colour, user bio, website link, and Discord information. To edit this, click the "EDIT" button and follow the instructions to fill the form. When finished, press "EDIT" once more.

To add media, click "+ ADD ENTRY" underneath any of the tabs. A popup will appear asking for information on the media. Click the "ADD MEDIA" button to add it to the list.

To view more information on a media, click its entry on the list. A card will appear showing the info. From here you can click buttons to edit, delete, or move the media.

To edit the media, click "EDIT" and fill in the form. This data will be saved when the card is closed. To move media, click "MOVE" to display a menu of the other tabs, and select the tab you want to move it to. To delete media, click "DELETE". To close the card, click "SAVE & CLOSE" or click outside the box.

To add a category, go to the category list on the left side and click "ADD". To delete a category, click "DELETE". To edit the category's name, click "EDIT" and a small form will appear asking for the new name.

## Instructions for admins

After logging in, admins are presented with a blank table. To view users, they must type in the username into the bar and click the magnifying glass button (search). They are given the option to BAN, UNBAN, or DELETE users and can view the user's information.

After an admin BANS a user, the user will be shown a message upon trying to log in telling them that they've been banned and can't access their account. When an admin UNBANS a user, that user will regain access to their account. When an admin DELETEs a user, that user is removed from the registry and all their information is destroyed.


## Routes

### POST /users/login
Logs user in and creates a new session in the database.
```js
{
 username: <str>
 password: <str>
}
```

### GET /users/logout
Logs the authenticated user making the request out and destroys the session.

### POST /users
Adds a user to the registry.
```js
{
 username: <str>
 password: <str>
}
```

### GET /users/:username
Returns the user document whose username is equal to \<username\>.

### DELETE /users/:username
Deletes the user document whose username is equal to \<username\>.

### POST /users/:username
Adds a new media to the user's collection.
```js
{
 category: <str>
 status: "completed" || "inprogress" || "interested"
 title: <str>
 year: <int>
 rating: <int>
 notes: <int>
}
```
### POST /users/:username/:addCategory
Adds a new \<category\> to the the database.
```js
{
  nameToChange: <str> 
  newName: <str>
}
```

### DELETE /users/:username/:deleteCategory
Deletes a single \<category\>
```js
{
 name: <str>
}
```

### PATCH /users/:username
Updates the user named \<username\> using an object whose key-value pairs describe which attributes should be changed and how.
```js
{
 [key]: <value>
 ...
}
```

### PATCH /users/media/:username/:category
Deletes the media owned by the user named \<username\> in \<category\> under \<status\>.
```js
{
 status: <str>,
 index: <int>
}
```

### DELETE /users/media/:username/:category
Updates the media owned by the user named \<username\> in \<category\> under \<status\>. \<changes\> is an object whose key-value pairs describe which attributes should be changed and how.
```js
{
 status: <str>,
 index: <int>,
}

### PATCH /users/:username/:editCategory
Updates the \<category\> owned by the user named \<username\>. 
```js
{
 name: <str>
}
```


## Libraries used
* React
  * React color, React router dom, React uid 
* Material UI core, icons, and lab
* MongoDB, Mongoose
* Express

## Authors
Media Tracker was developed as the final semester project for the course CSC309 at the University of Toronto, Canada. The authors for Media Tracker include:
* Mayra Nihal
* Erin Amer
* Vipon Kaur
