require('dotenv').config()
const express = require('express');
const app = express();

const myapi='https://api.nationalize.io?name=nathaniel';
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/login',(req,res)=>{
    res.send('this is login page')
})

app.get('/signup',(req,res)=>{
    res.send('this is signup page')
})

app.get('/API',(req,res)=>{
    res.send(process.env.API)
})

app.get('/html',(req,res)=>{
    res.json(myapi)
})
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});