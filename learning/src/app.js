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
// post api
app.post("/notes", (req, res) => {
  const data = req.body;
  noteModel.create({
    title: data.title,
    description: data.description,
  });
  res.status(201).json({
    message: "Note created",
  });
});

// get api
app.get("/notes", async (req, res) => {
  // for finding a particular note
  // const notes = await noteModel.find({
  //   title:"love_Story1"
  // });

  const notes = await noteModel.find();
  res.status(200).json({
    message: "fetched data successfully",
    notes: notes,
  });
});

// delete api
app.delete("/notes/:id", async (req, res) => {
  const id = req.params.id;
  await noteModel.findOneAndDelete({
    _id: id,
  });
  res.status(200).json({
    message: "note deleted successfully",
  });
});

// patch ap

app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const description= req.body.description
  await noteModel.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      description: description,
    },
  );
  res.status(200).json({
    message: "noted updated successfully",
  });
});

module.exports = app;
