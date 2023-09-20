//what does a typical API look like?
// <SnippetsList />                GET http://localhost:9000/snippets
// <Snippet/>                      GET http://localhost:9000/snippets/12345
// <SnippetCreationForm/>          POST http://localhost:9000/snippets
// <SnippetListItem/>              PUT, DELETE http://localhost:9000/snippets/12345

// express is a function that returns an object that has methods and properties
// why we use express? because it's a framework that makes it easy to build web applications and APIs
import express from "express";
import { nanoid } from "nanoid";

// app is an instance of express
// why i make it const? because i don't want to change it
// why i make instance of express? because i want to use express methods and properties
const app = express();
// why i use app.use ? because i want to use a middleware (a function that runs before the request is handled)
app.use(express.json());

const db = [
  {
    id: "DBCC2857",
    content: `ReferenceError: qwüdpkqwdkpokqwpdk is not defined
      at file:///C:/Users/basic/projects/BEAM/mongodb-project/server/index.js:9:1
      at ModuleJob.run (node:internal/modules/esm/module_job:197:25)
      at async Promise.all (index 0)
      at async ESMLoader.import (node:internal/modules/esm/loader:337:24)
      at async loadESM (node:internal/process/esm_loader:88:5)
      at async handleMainPromise (node:internal/modules/run_main:61:12)
  [nodemon] app crashed - waiting for file changes before starting...`,
  },
  {
    id: "6F79257C",
    content: `console.log(3791827398d7qwe98d7wq9d)
  
  SyntaxError: Invalid or unexpected token
  at ESMLoader.moduleStrategy (node:internal/modules/esm/translators:115:18)
  at ESMLoader.moduleProvider (node:internal/modules/esm/loader:289:14)
  at async link (node:internal/modules/esm/module_job:70:21)
  [nodemon] app crashed - waiting for file changes before starting...
  `,
  },
];

app.get("/", (request, response) => {
  response.send("request received at  /");
});
app.get("/snippets", (request, response) => {
  console.log("request received at  /snippets");
  response.send(db);
});

app.get("/snippets/:id", (request, response) => {
  const id = request.params.id;
  const foundDocument = db.find((item) => item.id === id);
  if (foundDocument) response.send(foundDocument);
  else response.status(404).send("snippet not found");
});

app.post("/snippets", (request, response) => {
  // 1) get content
  // 2) save it in the db
  //   test with (postman or rest client)
  console.log(request.body);
  const newDocument = {
    id: nanoid(10),
    content: request.body.content,
  };
  db.push(newDocument);
  response.send(newDocument);
});

app.delete("/snippets/:id", (request, response) => {
  const id = request.params.id;
  const foundDocument = db.find((item) => item.id === id);
  if (foundDocument) {
    db.splice(db.indexOf(foundDocument), 1);
    response.send("snippet deleted successfully");
  } else response.status(404).send("snippet not found");
});

//  PUT / Update a snippet

app.put("/snippets/:id", (request, response) => {
  const id = request.params.id;

  //   found the document with the id
  const foundDocument = db.find((item) => item.id === id);

  if (foundDocument) {
    // get the index i.e (id) of the document
    const indexOfDoc = db.indexOf(foundDocument);
    // update the content
    db[indexOfDoc].content = request.body.content;
    // its a good practice to send the updated document back to the client not entire db
    response.send(db[indexOfDoc]);
  } else response.status(404).send("snippet not found");
});

app.listen(9000, () => {
  console.log("server is running on port 9000");
});

// HTTP VERBS
// GET -> i want some data
// POST -> i want to create something
// UPDATE (or PUT) -> i want to update something with this ID
// DELETE -> i want to do delete something with this ID
