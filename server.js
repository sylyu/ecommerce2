
var express			= require('express'),
bodyParser	= require('body-parser'),
mongoose		= require('mongoose'),
path        = require('path')
// webserver
var app				  = express();
// use json body parser for Angular
app.use(bodyParser.json());

// use only when mongo has issues finding ObjectId (see mongoose docs)
var ObjectId    = mongoose.Types.ObjectId;
// fix deprecation warnings 
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

// document - database table
var NNSchema = new mongoose.Schema({
name: {
type: String,
required:   [true, "Please enter a name to add."],
minlength:  [3, "Name must be at least 3 characters"]
}
},{ timestamps: true });



// MODEL MUST BE NAMED THE SAME BELOW
// connect to the database 
mongoose.connect('mongodb://localhost/NNs');


// set up this schema in our Models as 'NN'
mongoose.model('NN', NNSchema); 

// object constructor - we are retrieving this schema from our Models named MM
let NN = mongoose.model('NN'); 

// use native promises -- uses the promise library to save an object
mongoose.Promise = global.Promise;

// *********** Set up our routes *******************

// Setting up all the static routes to come from our public directory.
// Our public directory is created by angular "ng build". --watch is so it automatically updates when we save the file.
// If we don't declare a get push, put or delete, or delete route, then it will come from the static file.
app.use(express.static( __dirname + '/public/dist/public' ));

// this gets ignored by express because public/dist/public/index.html exists
// we told express.static to use that public file instead
app.get('/index.html', (req, res)=> {
res.json({message: "this is my app route"});
});

// GETS ALL NNs
app.get('/api/nns', (req, res)=> {
NN.find({}, function(err, nns) {
if (err){
console.log("There was a problem retrieving all the nns",err);
res.status(404).json(err);
}
else{
console.log("Got all the nns", nns);
res.status(200).json({nns: nns});
}
})
});

// CREATE NEW NN
app.post('/api/nns/add', (req, res)=> {
let newNN = new NN(req.body);
console.log("creating a new nn");
newNN.save((err, added)=> {
if (err) {
  console.log("error in creating a new nn", err);
  res.json({status: false, message: "Create nn", data: err});
}else{ 
  console.log('successfully added a nn!');
  res.json({status: true, message: "Create nn", data: added});
}
})
});

// GET A SINGLE NN
app.get('/api/nns/:id', (req, res)=> {
console.log("getting nn by id: ", req.params.id);
NN.findById(
req.params.id,
(err,found)=> {
  if (err) {
      console.log("find error: " + err);
      res.status(404).json(err);
  }
  else {
      console.log("find success")
      res.status(200).json(found);
  }
});
});

// UPDATE NN
app.put('/api/nns/:id', (req, res) => {
console.log(`edit`);
console.log(`about to edit ${req.params.id} to ${req.body.name}`);
NN.findByIdAndUpdate(
req.params.id,
{$set: {name: req.body.name}},
// mongoose deprecation fix - see
{ new:true, useFindAndModify:false, 
  passRawResult: true, runValidators: true 
}, 
(err) => {
  console.log(`findOneAndUpdate complete ${err}`);
  if (err) {
    console.log("error in updating nn");
    res.json({status: false, message: "Edit NN", data: err});
  }else{ 
    console.log('successfully updated a nn!');
    res.json({status: true, message: "Edit NN"});
  }
})
})

// DELETE NN
app.delete('/api/nns/:id', (req, res)=> {
let idToDelete = ObjectId(req.params.id);
console.log("deleting nn by id: ", idToDelete);
NN.findByIdAndDelete(idToDelete, (err, deleted)=> {
console.log("deleted. " + deleted);
res.status(200).json(deleted);
});
});

// this route will be triggered if any of the routes above did not match
app.all("*", (req,res,next) => {
res.sendFile(path.resolve("./public/dist/public/index.html"))
});

// tell the express app to listen on port 8001
app.listen(8001, () => {
console.log("listening on port 8001");
});
