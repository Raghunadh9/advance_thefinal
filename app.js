const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
var https = require("https");
let theftData = []
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({
  extended: true
}))
mongoose.connect("mongodb+srv://raghunadh:raghunadh@cluster0.croak62.mongodb.net/Numerology", {
  useNewUrlParser: true
})

//5)print

const itemsSchema = {
  chaldean: String,
  pythogorous: String,
  tot_letters: String,
  g2tot: String,
  g3tot: String,
  g2vtot: String,
  g3vtot: String,
  g2nettot: String,
  g3nettot: String,
}
const Item = mongoose.model("Item", itemsSchema)
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
})
app.get("/data", function(req, res) {
  Item.find({}, function(err, found) {
    if (err) {
      console.log(err);
      res.render('error');
    } else {
      res.render('saved', {
        allData: found
      })
    }
  });
})

app.post("/data", function(req, res) {
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
  Item.find({}, function(err, foundItems) {
    if (foundItems) {
      Item.insertMany(itemData, function(err) {
        res.redirect("/data")
        // res.render('saved',{allData:foundItems})
      })

    } else {
      res.render('saved', {
        allData: foundItems
      })
    }
  });
});
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (!err) {
      res.redirect("/data")
    } else {
      console.log("Err:" + err);
      res.render('error')
    }
  })
})
app.post("/search", function(req, res) {
  const searchFilter = req.body.searchFilter;
  Item.find({
    g2tot: searchFilter
  }, function(err, foundSearch) {
    if (err) {
      console.log(err);
      res.render('error')
    } else {
      res.render('saved', {
        allData: foundSearch
      })
    };
  })
})

// pythagorean
app.post("/searchp", function(req, res) {
  const searchpythagorean = req.body.pythagorean;
  Item.find({
    g3tot: searchpythagorean
  }, function(err, foundPyth) {
    if (err) {
      console.log(err);
      res.render('error')
    } else {
      res.render('saved', {
        allData: foundPyth
      })
    }
  })
})
app.post("/", function(req, res) {
  var query = req.body.query;
  var url = ("https://roohhi.com/convert?name=" + query)
  https.get(url, function(response) {
    const chunks = []
    response.on('data', function(chunk) {
      chunks.push(chunk)
    })
    response.on('end', function() {
      const data = Buffer.concat(chunks)
      var fullData = JSON.parse(data);
      var chaldean = fullData.name_g2_block;
      var pythogorous = fullData.name_g3_block;
      var tot_letters = fullData.tot_letters;
      var g2tot = fullData.g2tot;
      var g3tot = fullData.g3tot;
      var g2vtot = fullData.g2vtot;
      var g3vtot = fullData.g3vtot;
      var g2nettot = fullData.g2nettot;
      var g3nettot = fullData.g3nettot;
      let queryAll = req.body.query;
      res.write(`<!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8">
          <title>
          Astrology
          </title>

          <link
          href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap"
          rel="stylesheet">
          <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap" rel="stylesheet">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Sacramento&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script>
        </head>
        <body>
        <nav class="navbar navbar-expand-lg "style="background-color:#ffdf00;">
          <div class="container-fluid">
            <a  class="navbar-brand" href="/"><span style="color:#F73173;font-weight:700;font-family: 'Sacramento', cursive;font-weight:bolder;">Astrology</span></a>

            <div style="color:#F73173" class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link "style="color:#F73173;font-weight:700" href="/">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link "style="color:#F73173;font-weight:700" href="/data">Data List</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    <br>
    <center>
      <img src="ganesh.png" alt="Ganesh"height="100px">
      <h4 style="color:orange">Shree Ganeshay Namah</h4>

    </center><hr noshade style="color:black">
          <section class="ftco-section">
          <div class="container">
            <form action="/" method="post" class="login-form">
              <div class="form-group w-75">
                <label style="color:#9B1FE8;font-weight:700"for="heaven">Name:</label><br>
                <input id="heaven"style="border:2px solid #FF5733" type="text" value="${query}"name="query" class="form-control-sm w-75" placeholder="Name" required>
                <button type="submit" class="btn rounded submit" style="background-color: #E52B50;color: white;padding: 3px;width:150px;margin-left:630px;margin-top:12px;">Calculate</button>
              </div>

              <div class="form-group">

              </div>
            </form>
          </div>
        	</section><br>
          <div class="container">
          <section class="table">

          <form action="/data"method="post">

          <table
          class="table-bordered full_table"  style="border-collapse: collapse;width:90%;">
				<thead style="background-color:#9B1FE8;"class="c_pad_head">
					<tr>
						<th class="list_b">Group</th>
						<th class="list_b">Name</th>
						<th class="list_b">Total</th>
						<th class="list_b">V</th>
						<th class="list_b">C</th>
					</tr>
				</thead>
				<tbody>
						<td>N</td>
						<td>
							<table id="name_g2_block">&nbsp;${chaldean}<input id="o"type="text"name="chaldean"value="${chaldean}"</input></table>
						</td>
						<td  style="padding:15px"id="g2tot">${g2tot}<input id="o"type="text"name="g2tot"value="${g2tot}"</input></td>
						<td style="padding:15px"id="g2vtot">${g2vtot}<input id="o"type="text"name="g2vtot"value="${g2vtot}"</input></td>
						<td style="padding:15px"id="g2nettot">${g2nettot}<input id="o"type="text"name="g2nettot"value="${g2nettot}"</input></td>
					</tr>
					<tr>
						<td>S</td>
						<td>
							<table id="name_g3_block">${pythogorous}<input id="o"type="text"name="pythogorous"value="${pythogorous}"</input></table>
						</td>
						<td style="padding:15px"id="g3tot">${g3tot}<input id="o"type="text"name="g3tot"value="${g3tot}"</input></td>
						<td style="padding:15px"id="g3vtot">${g3vtot}<input id="o"type="text"name="g3vtot"value="${g3vtot}"</input></td>
						<td style="padding:15px"id="g3nettot">${g3nettot}<input id="o"type="text"name="g3nettot"value="${g3nettot}"</input></td>
					</tr>
					<tr>
						<td>
							<strong> Name letters count - </strong><span id="tot_letters">${tot_letters}<input id="o"type="text"name="tot_letters"value="${tot_letters}"</input></span><br>
						</td>
						<td>
            </td>
            <td style="padding:15px" colspan="3">
            <button class="btn btn-md btn-success"style="border-radius:10px;"type="submit">Save</button>
            <a class="btn btn-md btn-danger"style="border-radius:10px;"href="/">Cancel</a>
            </td>
					</tr>

				</tbody>
			</table>
      </div>

      </form>
                      </section>
                      <center>
                      <footer id="sticky-footer" class="f_ flex-shrink-0 py-4 "style="background-color:#ffdf00;color:#F73173">
                    <div class="container text-center">
                      <small>Copyright &copy; Astrology</small><br><br>
                      <small>Made by</small>
                      <strong ><h4 style="color:#F73173;font-weight:700;"><span style="font-family: 'Sacramento', cursive;font-weight:900;">🔥Raghunadh Hital🔥</span></h4></strong>
                    </div>
                  </footer>
                      </center>
        </body>
      </html>
        `)
      res.send();
    })
  })
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, function(req, res) {
  console.log("Yes!");
});
