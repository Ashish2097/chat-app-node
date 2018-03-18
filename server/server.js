const path = require('path');
const express = require('express');

const app = express();
const publicPath = path.join(__dirname+"/../public");
const port = process.env.PORT || 3000 ;   //port = PORT is specified otherwise, 3000
app.use(express.static(publicPath));

app.listen('3000',(res, err)=>{
  if(!err)
   console.log(`Listening at ${port}`);
  else
   console.log("error" + err);
});
