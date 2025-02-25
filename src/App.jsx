import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AgGridReact } from 'ag-grid-react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ClientSideRowModelModule } from 'ag-grid-community';

function AddBook({ addBook }) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState({ title: '', author: '', year: '', isbn: '', price: '' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSave = () => {
    addBook(book);
    handleClose();
  };

  const inputChanged = (event) => {
    setBook({ ...book, [event.target.name]: event.target.value });
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Add Book
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Book</DialogTitle>
        <DialogContent>
          <TextField name="title" label="Title" fullWidth margin="dense" onChange={inputChanged} />
          <TextField name="author" label="Author" fullWidth margin="dense" onChange={inputChanged} />
          <TextField name="year" label="Year" fullWidth margin="dense" onChange={inputChanged} />
          <TextField name="isbn" label="ISBN" fullWidth margin="dense" onChange={inputChanged} />
          <TextField name="price" label="Price" fullWidth margin="dense" onChange={inputChanged} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function App() {
  const [books, setBooks] = useState([]);

  const columnDefs = [
    { field: 'title', sortable: true, filter: true },
    { field: 'author', sortable: true, filter: true },
    { field: 'year', sortable: true, filter: true },
    { field: 'isbn', sortable: true, filter: true },
    { field: 'price', sortable: true, filter: true },
    {
      headerName: '',
      field: 'id',
      width: 90,
      cellRenderer: (params) => (
        <IconButton onClick={() => deleteBook(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch('https://bookstore-2ca2e-default-rtdb.europe-west1.firebasedatabase.app/books.json')
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error('Fetch error:', err));
  };

  const addKeys = (data) => {
    if (!data) return;
    const keys = Object.keys(data);
    const booksWithKeys = keys.map((key) => ({ ...data[key], id: key }));
    setBooks(booksWithKeys);
  };

  const addBook = (newBook) => {
    fetch('https://bookstore-2ca2e-default-rtdb.europe-west1.firebasedatabase.app//books.json', {
      method: 'POST',
      body: JSON.stringify(newBook),
    })
      .then(() => fetchBooks())
      .catch((err) => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(`https://bookstore-2ca2e-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`, {
      method: 'DELETE',
    })
      .then(() => fetchBooks())
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', marginTop: '20px' }}>
        <AddBook addBook={addBook} />
        <div className="ag-theme-material" style={{ height: 400, width: 600, margin: '20px auto' }}>
          <AgGridReact rowData={books} columnDefs={columnDefs} modules={[ClientSideRowModelModule]} />
        </div>
      </div>
    </>
  );
  
}

export default App;
