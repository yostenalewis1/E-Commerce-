require('./db')
const express = require("express");
const app = express();
require('express-async-errors')
const morgan = require('morgan')
const port =3000
app.use(morgan('tiny'))
app.use(express.json());
 ////////////Routs
const userRoute =require('./routes/user')
const authRoute = require('./routes/auth')
const productRouter = require('./routes/product')
const cartRouter = require('./routes/cart')
 




app.use('/api/user',userRoute)
app.use('/api/authuser',authRoute)
app.use('/api/products',productRouter)
app.use('/api/carts',cartRouter)
 


////error handling 

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    message: err.message
  });
});
app.listen(port ,()=>
{
    console.log(`Server running at http://localhost:${port}/`);
});