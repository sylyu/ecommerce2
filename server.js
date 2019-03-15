
var express	= require('express'),
bodyParser	= require('body-parser'),
mongoose		= require('mongoose'),
path        = require('path'),
multer      = require('multer');
var port    = 8001;
var upload=multer({
  dest:'src/assets/images/products/'
  // dest:'uploads/' // this saves your file into a directory  alled uploads
});

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
var ProductSchema = new mongoose.Schema(
  {
    name: {
    type: String,
    required:   [true, "Please enter the product name."],
    minlength:  [3, "Name must be at least 3 characters"]
    },
    description: {
      type: String,
      required:  [true, "Please enter a product description."],
      minlength: [4, "Product description must be at least 3 characters in length."]
    },
    price: {
      type: Number,
      required:  [true, "Please enter the price of the product."],
      minlength: [1, "Product price must be at least 3 characters in length."]
    },
    unit_in_stock: {
      type: Number,
      required:  [true, "Please enter the amount in stock."],
      minlength: [1, "Product units must be at least 1 characters in length."]
    }
  },
  { timestamps: true }
);

// MODEL MUST BE NAMED THE SAME BELOW
// connect to the database 
mongoose.connect('mongodb://localhost/Products');


// set up this schema in our Models as 'Product'
mongoose.model('Product', ProductSchema); 

// object constructor - we are retrieving this schema from our Models named MM
let Product = mongoose.model('Product'); 

// use native promises -- uses the promise library to save an object
mongoose.Promise = global.Promise;

// *********** Set up our routes *******************

// Setting up all the static routes to come from our public directory.
// Our public directory is created by angular "ng build". --watch is so it automatically updates when we save the file.
// If we don't declare a get push, put or delete, or delete route, then it will come from the static file.
app.use(express.static( __dirname + '/public/dist/public' ));

// app.use(multer({dest: './uploads/',
//   rename: function(fieldname, filename){

//   }
// }));

// this gets ignored by express because public/dist/public/index.html exists
// we told express.static to use that public file instead
// app.get('/index.html', (req, res)=> {
//   res.json({message: "this is my app route"});
// });

// GETS ALL Products
app.get('/api/products', (req, res)=> {
  Product.find({}, function(err, products) {
    if (err){
      console.log("There was a problem retrieving all the products",err);
      res.status(404).json(err);
    } else {
      console.log("Got all the products", products);
      res.status(200).json({products: products});
    }
  })
});

// app.post(‘/api/photo’,function(req,res){
//   var newItem = new Item();
//   newItem.img.data = fs.readFileSync(req.files.userPhoto.path)
//   newItem.img.contentType = ‘image/png’;
//   newItem.save();
//  });

// CREATE NEW Product
app.post('/api/products/add', upload.single('file-to-upload'),(req, res)=> {
  let newProduct = new Product(req.body);
  console.log("creating a new product");
  newProduct.save((err, added)=> {
  if (err) {
    console.log("error in creating a new product", err);
    res.json({status: false, message: "Create product", data: err});
  }else{ 
    console.log('successfully added a product!');
    res.json({status: true, message: "Create product", data: added});
  }
  })
});

// GET A SINGLE Product
app.get('/api/products/:id', (req, res)=> {
  console.log("getting product by id: ", req.params.id);
  Product.findById(
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

// UPDATE Product
app.put('/api/products/:id', (req, res) => {
  console.log(`edit`);
  console.log(`about to edit ${req.params.id} to ${req.body.name}`);
  Product.findByIdAndUpdate(
    req.params.id,
    {$set: {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      unit_in_stock: req.body.unit_in_stock
    }},
    // mongoose deprecation fix - see
    { new:true, useFindAndModify:false, 
      passRawResult: true, runValidators: true 
    }, 
    (err) => {
      console.log(`findOneAndUpdate complete ${err}`);
      if (err) {
        console.log("error in updating product");
        res.json({status: false, message: "Edit Product", data: err});
      }else{ 
        console.log('successfully updated a product!');
        res.json({status: true, message: "Edit Product"});
      }
    })
})

// DELETE Product
app.delete('/api/products/:id', (req, res)=> {
  let idToDelete = ObjectId(req.params.id);
  console.log("deleting product by id: ", idToDelete);
  Product.findByIdAndDelete(idToDelete, (err, deleted)=> {
    console.log("deleted. " + deleted);
    res.status(200).json(deleted);
  });
});

// this route will be triggered if any of the routes above did not match
app.all("*", (req,res,next) => {
  res.sendFile(path.resolve("./public/dist/public/index.html"))
});

// tell the express app to listen on port 8001
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
