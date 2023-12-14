const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');//imports id npm
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');//imports helper functions

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });//returns all note in db.json
  
notes.post('/', (req, res) => {
  console.log(req.body);

  const { title, text } = req.body;
  //checks to see if object and title and text key before making object
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),//adds unique id to the new object
    };

    readAndAppend(newNote, './db/db.json');//appends to db.json file
    res.json(newNote);//returns new note
  } else {
    res.json('Error in adding tip');//returns error message if not successfully created new note
  }
});

// DELETE Route for a specific tip
notes.delete('/:id', (req, res) => {
  const notesId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all tips except the one with the ID provided in the URL
      const result = json.filter((notes) => notes.id !== notesId);

      // Save that array to the filesystem
      writeToFile('./db/db.json', result);

      // Respond to the DELETE request
      res.json(`Item ${notesId} has been deleted 🗑️`);
    });
});

module.exports = notes;