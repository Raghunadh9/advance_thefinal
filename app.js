require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var https = require("https");
let theftData = [];
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect(
  "mongodb+srv://admin-raghunadh:pradyumna@cluster0.dlrxw.mongodb.net/numer?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);
const itemsSchema = {
  chaldean: {
    type: String,
    unique: true,
  },
  pythogorous: String,
  tot_letters: Number,
  g2tot: Number,
  g3tot: Number,
  g2vtot: Number,
  g3vtot: Number,
  g2nettot: Number,
  g3nettot: Number,
};
const Item = mongoose.model("Item", itemsSchema);
app.get(["/:id"], function (req, res) {
  res.render("index.ejs", { paramName: req.params.id });
});
app.get("/mongo/data", function (req, res) {
  Item.find({}, function (err, found) {
    if (err) {
      console.log(err);
      res.render("error");
    } else {
      res.render("saved", {
        allData: found,
      });
    }
  });
});

app.post("/mongo/data", function (req, res) {
  const chaldeana = req.body.chaldean;
  const pythogorousa = req.body.pythogorous;
  const tot_lettersa = req.body.tot_letters;
  const g2tota = req.body.g2tot;
  const g3tota = req.body.g3tot;
  const g2vtota = req.body.g2vtot;
  const g3vtota = req.body.g3vtot;
  const g2nettota = req.body.g2nettot;
  const g3nettota = req.body.g3nettot;
  const itemData = new Item({
    chaldean: chaldeana,
    pythogorous: pythogorousa,
    tot_letters: tot_lettersa,
    g2tot: g2tota,
    g3tot: g3tota,
    g2vtot: g2vtota,
    g3vtot: g3vtota,
    g2nettot: g2nettota,
    g3nettot: g3nettota,
  });
  Item.find({}, function (err, foundItems) {
    if (foundItems) {
      Item.insertMany(itemData, function (err) {
        res.redirect("/mongo/data");
        // res.render('saved',{allData:foundItems})
      });
    } else {
      res.render("saved", {
        allData: foundItems,
      });
    }
  });
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      res.redirect("/mongo/data");
    } else {
      console.log("Err:" + err);
      res.render("error");
    }
  });
});
app.post("/search", function (req, res) {
  const searchFilter = req.body.searchFilter;
  Item.find(
    {
      g2tot: searchFilter,
    },
    function (err, foundSearch) {
      if (err) {
        console.log(err);
        res.render("error");
      } else {
        res.render("saved", {
          allData: foundSearch,
        });
      }
    }
  );
});

// pythagorean
app.post("/searchp", function (req, res) {
  const searchpythagorean = req.body.pythagorean;
  Item.find(
    {
      g3tot: searchpythagorean,
    },
    function (err, foundPyth) {
      if (err) {
        console.log(err);
        res.render("error");
      } else {
        res.render("saved", {
          allData: foundPyth,
        });
      }
    }
  );
});

app.post("/", function (req, res) {
  var query = req.body.query;
  var url = "https://zeppoh.com/convert?name=" + query;
  https.get(url, function (response) {
    const chunks = [];
    response.on("data", function (chunk) {
      chunks.push(chunk);
    });
    response.on("end", function () {
      let number = parseInt(req.body.number);
      let validNumber;
      if (number === null || isNaN(number) || number === 0) {
        validNumber = " ";
      } else {
        validNumber = number;
      }
      const data = Buffer.concat(chunks);
      var fullData = JSON.parse(data);
      var chaldean = fullData.name_g2_block;
      var pythogorous = fullData.name_g3_block;
      var tot_letters = fullData.tot_letters;
      var g2tot = fullData.g2tot + validNumber;
      var g3tot = fullData.g3tot + validNumber;
      var g2vtot = fullData.g2vtot;
      var g3vtot = fullData.g3vtot;
      var g2nettot = fullData.g2nettot;
      var g3nettot = fullData.g3nettot;
      let queryAll = req.body.query;

      res.write(`<!DOCTYPE html>
      <html lang="en" dir="ltr">
          <head>
              <meta charset="utf-8">
              <title>Astrology</title>
              <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap" rel="stylesheet">
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Sacramento&display=swap" rel="stylesheet">
              <style>#o {
                display: none;
                padding: 0;
                margin: 0;
              }
              .full_table tr td {
                padding: 10px 25px !important;
              }
              .full_table_saved tr td {
                  padding: 5px 12px !important;
              }
              .c_pad_head {
                position: sticky;
                top: 0;
                background-color: #1E84EB;
                color: #fff;
              }
              </style>
              <script src="https://cdn.tailwindcss.com"></script>
            
            </head>
      
      <body>
         
       <!-- component -->
      <header class="header z-500  top-0 bg-green-600 text-white  shadow-md flex items-center justify-between px-8 py-02">
          <!-- logo -->
          <h1 class="w-3/12 text-2xl">
              <a href="/" class="text-white"style="font-family: 'Sacramento', cursive;font-weight:900;">
                Astrology
              </a>
          </h1>
          
        
          <!-- navigation -->
          <nav class="nav font-semibold text-lg">
              <ul class="flex items-center">
                  <li class="p-4 border-b-2 border-green-500 border-opacity-0 hover:border-opacity-300 hover:text-white duration-200 cursor-pointer active">
                    <a href="/">Home</a>
                  </li>
                  <li class="p-4 border-b-2 border-green-500  text-white border-opacity-0 hover:border-opacity-300 hover:text-white duration-200 cursor-pointer">
                    <a href="/mongo/data">Data List</a>
                  </li>
                  
              </ul>
          </nav>
        </header>
         
        <!-- component -->
<div class="flex flex-wrap  w-full h-screen">
  <div class="w-2/12 rounded p-3 ">
    <div class=" items-center space-x-4 p-2 mb-5">
      <img  src="ganesh.png" class="h-20">
      <div>
        <h4 class="text-green-500 font-bold text-lg">Shree Ganeshay Namah</h4>
        
      </div>
  </div>
      
  </div>

  <div class="w-9/12">
      <div class="p-4 text-gray-500">
         
           
          <section >
              
            <div class="container">
                <div >
                    <form  action="/" method="post">   
               
                    <div class="relative">
                      <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                        <input id="default-search"  type="text" 
                            value="${query}" name="query" class="block p-2 pl-10 w-full text-sm text-gray-900 bg-green-100 rounded-lg border border-gray-300 focus-within:border-green focus-within:ring focus-within:ring-green dark:focus-within:border-green focus-within:ring-opacity-20" placeholder="Search Name Here" onkeyup="this.value = this.value.replace(/[^a-zA-Z ]/g, '')" required>
                        <!-- <input  type="number" name="number"
                            value="${validNumber}" class=" form-control-sm w-25" placeholder="Number"> -->
                        <button type="submit" class="text-white absolute right-0 bottom-0 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Calculate</button>
                    </div><br>
                    <div class="relative">
                        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      <input  type="number" name="number"
                      value="${validNumber}" class="block p-2 pl-10 w-md text-sm text-gray-900 bg-green-100 rounded-lg border border-gray-300 focus-within:border-green focus-within:ring focus-within:ring-green dark:focus-within:border-green focus-within:ring-opacity-20"placeholder="Type Number Here" >
                    </div>
                </form>
              </div>
                </div>
        </section><br>
        <div class="container">
            <section class="table">
                <form action="/mongo/data" method="post">
                   
                      <table class="border  full_table border-green-800" style="border-collapse: collapse;width:90%;">
                          <thead class="c_pad_head bg-green-600 text-white border border-green-800">
                              <tr>
                                  <th class="border border-green-800">Group</th>
                                  <th class="border border-green-800">Name</th>
                                  <th class="border border-green-800">Total</th>
                                  <th class="border border-green-800">V</th>
                                  <th class="border border-green-800">C</th>
                              </tr>
                          </thead>
                          <tbody  class="border border-green-800">
                              <tr  class="border border-green-800">
                              <td  class="border border-green-800">N ${validNumber}</td>
                              <td  class="border border-green-800">
                                  <table   id="name_g2_block">&nbsp;${chaldean}<input
                                          id="o" type="text" name="chaldean" value="${chaldean}" </input></table>
                              </td>
                              <td class="border border-green-800" id="g2tot">${g2tot}<input id="o"
                                      type="text" name="g2tot" value="${g2tot}" </input></td>
                              <td class="border border-green-800" id="g2vtot">${g2vtot}<input id="o"
                                      type="text" name="g2vtot" value="${g2vtot}" </input></td>
                              <td class="border border-green-800" id="g2nettot">${g2nettot}<input id="o"
                                      type="text" name="g2nettot" value="${g2nettot}" </input></td>
                              </tr>
                              <tr class="border border-green-800">
                                  <td  class="border border-green-800">S ${validNumber}</td>
                                  <td class="border border-green-800">
                                      <table  >${pythogorous}<input
                                              id="o" type="text" name="pythogorous" value="${pythogorous}" </input></table>
                                  </td>
                                  <td class="border border-green-800" id="g3tot">${g3tot}<input id="o"
                                          type="text" name="g3tot" value="${g3tot}" </input></td>
                                  <td class="border border-green-800" id="g3vtot">${g3vtot}<input id="o"
                                          type="text" name="g3vtot" value="${g3vtot}" </input></td>
                                  <td class="border border-green-800" id="g3nettot">${g3nettot}<input
                                          id="o" type="text" name="g3nettot" value="${g3nettot}" </input></td>
                              </tr>
                              <tr class="border border-green-800">
                                  <td class="border border-green-800">
                                      <strong > Name letters count - </strong><span
                                            id="tot_letters">${tot_letters}<input id="o"
                                              type="text" name="tot_letters" value="${tot_letters}" </input></span><br>
                                  </td>
                                  <td class="border border-green-800">
                                  </td>
                                  <td class="border border-green-800" style="padding:15px" colspan="3">
                                      <button class="text-white  right-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" style="border-radius:10px;"
                                          type="submit">Save</button>
                                      <a class="text-white  right-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" style="border-radius:10px;" href="/">Cancel</a>
                                  </td>
                              </tr>
      
                          </tbody>  
                      </table>
                  
        </div>
    
        </form>
        </section>
      </div>
  </div>
</div>
      
         
          
          </center>
      </body>
      
      </html>
        `);
      res.send();
    });
  });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8175;
}
app.listen(port, function (req, res) {
  console.log("Yes!");
});
