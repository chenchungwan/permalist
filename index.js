import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "Pyth0n25*",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let items = [];

async function getItems() {
  const results = await db.query("select * from items")
  items = results.rows
  return(items)
}

app.get("/", async (req, res) => {
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: await getItems(),
  });
});



app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query(
      "INSERT INTO items (title) VALUES ($1)",
      [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.post("/edit", async (req, res) => {
  console.log("editing")
  console.log(req.body);
  const itemId = req.body.updatedItemId;
  const itemTitle = req.body.updatedItemTitle;

  try {
    await db.query("update items values set title = ($1) where id = $2", [itemTitle, itemId]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});


app.post("/delete", async (req, res) => {
  console.log("deleting done items")
  console.log(req.body)
  const itemId = req.body.deleteItemId;
  try {
    await db.query("delete from items where id = $1", [ itemId]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
