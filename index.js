const cors = require('cors');
const express = require('express');

const userRouter = require('./src/routers/user.router');

require('./src/db/mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRouter);



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
