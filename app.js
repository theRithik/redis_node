import express from ('express')
import  axios from('axios')
let redis = require('redis')
let port = process.env.PORT||4200
let app = express()

const client = redis.createClient({
    host:'localhost',
    port:6379
})

app.get('/data',(req,res)=>{
    let userInput = (req.query.country).trim();
    userInput = userInput?userInput:'india';
    const url = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${userInput}`;

    //check data is in redis or not
  
return client.get(`${userInput}`,(err,result)=>{
    if(result){
const output = JSON.parse(result)
res.send(output)
    }
    else{
        axios.get(url)
  .then((response)=>{
const output = response.data
client.setex(`${userInput}`,3600, JSON.stringify({source:'Redis Cache', output}))
res.send({source:'Api response', output})
  })
    }
})
  })

  //call the port like this http://localhost:4200/data?country=london

  app.listen(port,()=>{
    console.log(`${port}`)
  })

