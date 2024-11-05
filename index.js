import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();


app.use(bodyParser.json());


mongoose.connect('mongodb+srv://tanya:tanya@cluster0.t4m4p.mongodb.net/testdb?retryWrites=true&w=majority', 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));


const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
});

const Item = mongoose.model('Item', itemSchema);


app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  const newItem = new Item({ name, description });
  await newItem.save();
  res.status(201).json(newItem);
});


app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.status(200).json(items);
});


app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  const deletedItem = await Item.findByIdAndDelete(id);
  if (deletedItem) {
    res.status(200).json({ message: 'Item deleted successfully' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
