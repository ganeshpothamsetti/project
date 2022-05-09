const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const path = require('path')
const CsvParser = require("json2csv").Parser

const server = jsonServer.create()
const databaseFilePath = path.resolve(__dirname, 'database.json')
const router = jsonServer.router(databaseFilePath)
const usersFilePath = path.resolve(__dirname, 'users.json')
let userdb = JSON.parse(fs.readFileSync(usersFilePath, 'UTF-8'))

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '1h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function getUser({email, password}){
  return userdb.users.find(user => user.email === email && user.password === password)
}


// Dowload csv file for products
server.get('/download', (req, res) => {
  const data = JSON.parse(fs.readFileSync(databaseFilePath, 'UTF-8'))
  const csvFields = ["Name", "Cost", "Description", "Id"]
  const csvParser = new CsvParser({ csvFields });
  const csvData = csvParser.parse(data.products || []);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=products.csv");
  res.status(200).end(csvData);
})

// Register New User
server.post('/auth/register', (req, res) => {
  console.log("register endpoint called; request body:");
  console.log(req.body);
  const {email, password, name} = req.body;

  if(getUser({email, password})) {
    const status = 401;
    const message = 'Email and Password already exist';
    res.status(status).json({status, message});
    return
  }

  fs.readFile(usersFilePath, (err, data) => {  
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({status, message})
        return
      };

      // Get current users data
      var data = JSON.parse(data.toString());

      // Get the id of last user
      var last_item_id = data.users[data.users.length-1].id;

      //Add new user
      data.users.push({id: last_item_id + 1, email: email, password: password, name}); //add some data
      var writeData = fs.writeFile(usersFilePath, JSON.stringify(data), (err, result) => {  // WRITE
          if (err) {
            const status = 401
            const message = err
            res.status(status).json({status, message})
            return
          }
          // reload updated users information
          userdb = JSON.parse(fs.readFileSync(usersFilePath, 'UTF-8'))
          res.status(200).json({})
      });
  });
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  console.log(req.body);
  const {email, password} = req.body;
  const user = getUser({email, password})
  if (!user) {
    const status = 401
    const message = 'Incorrect email or password'
    res.status(status).json({status, message})
    return
  }
  const access_token = createToken({email, password})
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token, userName: user.name})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res.status(status).json({status, message})
    return
  }
  try {
    let verifyTokenResult;
     verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

     console.log('verify TokenResult ', verifyTokenResult)

     if (verifyTokenResult instanceof Error) {
       const status = 401
       const message = 'TokenExpiredError'
       res.status(status).json({status, message})
       return
     }
     next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res.status(status).json({status, message})
  }
})

server.use(router)

server.listen(8000, () => {
  console.log(`Backend server up and running with http://localhost:8000`)
})