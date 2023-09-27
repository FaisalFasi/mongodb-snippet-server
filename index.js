//what does a typical API look like?
// <SnippetsList />                GET http://localhost:9000/snippets
// <Snippet/>                      GET http://localhost:9000/snippets/12345
// <SnippetCreationForm/>          POST http://localhost:9000/snippets
// <SnippetListItem/>              PUT, DELETE http://localhost:9000/snippets/12345

// express is a function that returns an object that has methods and properties
// why we use express? because it's a framework that makes it easy to build web applications and APIs
import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";
import dotenv from "dotenv";
// Mongo DB ============================================

import mongoose from "mongoose";

dotenv.config(process.env.MONGO_URI);

const conn = mongoose.createConnection(process.env.MONGO_URI);

const SnippetSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    shortId: String,
  },
  { timestamps: true }
);

const Snippet = conn.model("snippet", SnippetSchema);

// Snippet.find();

// Express API  ============================================
// app is an instance of express
// why i make it const? because i don't want to change it
// why i make instance of express? because i want to use express methods and properties
const app = express();
// why i use app.use ? because i want to use a middleware (a function that runs before the request is handled)
app.use(express.json());
app.use(cors());

app.get("/snippets", async (request, response) => {
  const snips = await Snippet.find({});
  response.send(snips);
});

app.get("/snippets/:shortId", async (request, response) => {
  const { shortId } = request.params;
  const foundDocument = await Snippet.findOne({ shortId: shortId });

  if (foundDocument) {
    response.send(foundDocument);
  } else {
    response.status(404).send("snippet not found");
  }
});

app.post("/snippets", async (request, response) => {
  // 1) get content
  // 2) save it in the db
  //   test with (postman or rest client)

  const newDocument = {
    shortId: nanoid(8),
    title: request.body.title,
    content: request.body.content,
  };
  const createdSnippet = await Snippet.create(newDocument);
  response.send(createdSnippet);
});

app.delete("/snippets/:shortId", async (request, response) => {
  const { shortId } = request.params;
  // const foundDocument = await Snippet.findOne({ shortId: shortId });
  const deletedSnippet = await Snippet.deleteOne({ shortId: shortId });

  if (deletedSnippet.deletedCount > 0) {
    response.send("snippet deleted successfully");
  } else {
    response.status(404).send("snippet not found");
  }
});

//  PUT / Update a snippet

app.put("/snippets/:shortId", async (request, response) => {
  const { shortId } = request.params;

  const updatedSnippet = await Snippet.findOneAndUpdate(
    {
      shortId: shortId,
    },
    {
      title: request.body.title,
      content: request.body.content,
    },
    {
      new: true,
    }
  );
  response.send(updatedSnippet);
});

app.listen(9000, () => {
  console.log("server is running on port 9000");
});

// HTTP VERBS
// GET -> i want some data
// POST -> i want to create something
// UPDATE (or PUT) -> i want to update something with this ID
// DELETE -> i want to do delete something with this ID
