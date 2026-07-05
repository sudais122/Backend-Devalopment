import  { useEffect, useState } from 'react'

const App = () => {
  const [Jokes, setJokes] = useState([]);

  useEffect(() => {
    async function getdata() {
      try{
        const response = await fetch(`http://localhost:3000/jokes`);
        const Data =  await response.json();
        setJokes(Data);
        console.log(Data);
      }catch(error){
        console.log(error);
      }
    }
    getdata();
  }, [])
  
  return (
    <>
      <h1>Jokes</h1>
      <p>{Jokes.length}</p>
      {
        Jokes.map((Jokes)=>(
          <div key={Jokes.id}>
            <p>{Jokes.name}</p>
            <p>{Jokes.tittle}</p>
          </div>
        ))
      }
    </>
  )
}

export default App