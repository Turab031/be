const express = require("express");
const noteModel = require("./models/note.model");

const app = express();
app.use(express.json());

// const notes = [];
// app.post("/notes", (req, res) => {
//   notes.push(req.body);
//   res.status(201).json({
//     message: "note created successfully",
//   });
// });

// app.get("/notes", (req, res) => {
//   res.status(200).json({
//     message: "notes fecteched successfully",
//     notes: notes,
//   });
// });

// // in this index is included
// // :indicates->dynamic
// // and index is 0 based
// app.delete("/notes/:index", (req, res) => {
//   const index = req.params.index;
//   delete notes[index];
//   res.status(200).json({
//     message: "note deleted successfully",
//   });
// });

// // patch->update
// app.patch("/notes/:index", (req, res) => {
//   const index = req.params.index;
//   const desc = req.body.description;

//   notes[index].description = desc;

//   res.status(200).json({
//     message: "note updated succesfully",
//   });
// });

// crud api using database
app.post("/notes", async (req, res) => {
  const data = req.body;
  await noteModel.create({
    title: data.title,
    description: data.description,
  });
  res.status(201).json({
    message: "note created successfully",
  });
});

app.get("/notes", async (req,res) => {
  const notes = await noteModel.find();
  res.status(200).json({
    message: "notes fetched ",
    notes: notes,
  });
});

module.exports = app;
