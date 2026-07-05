import express from 'express';
const app = express();

app.get('/',(req,res)=>{
    res.send('server is running')
});

app.get('/jokes',(req,res)=>{
    const jokes = [
  {
    id: 1,
    name: "The Classic",
    title: "Why do programmers prefer dark mode? Because light attracts bugs!"
  },
  {
    id: 2,
    name: "Array Trouble",
    title: "Why did the developer go broke? Because he used up all his cache!"
  },
  {
    id: 3,
    name: "Infinite Loop",
    title: "A programmer's wife says: 'Go to the store, buy a loaf of bread. If they have eggs, buy a dozen.' He came back with 12 loaves of bread."
  },
  {
    id: 4,
    name: "Java vs JavaScript",
    title: "Java is to JavaScript what a car is to a carpet."
  },
  {
    id: 5,
    name: "Debugging Life",
    title: "99 little bugs in the code, 99 little bugs. Take one down, patch it around... 127 little bugs in the code!"
  },
  {
    id: 6,
    name: "The Optimist",
    title: "There are only 10 types of people in the world: those who understand binary and those who don't."
  },
  {
    id: 7,
    name: "CSS Struggles",
    title: "Two CSS properties walk into a bar. A barstool in a completely different bar falls over."
  },
  {
    id: 8,
    name: "Naming Things",
    title: "There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors."
  },
  {
    id: 9,
    name: "The Promise",
    title: "Why couldn't the JavaScript developer commit? He had trust issues with his Promises."
  },
  {
    id: 10,
    name: "React Reality",
    title: "Why did the React component feel lost? Because it didn't know what state it was in!"
  }
    ];

    res.send(jokes);
})
const port = 3000;
app.listen(port,()=>{
    console.log(`Server is runnig on port ${port}`);
})