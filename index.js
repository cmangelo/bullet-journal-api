const cors = require('cors');
const express = require('express');

const userRouter = require('./src/routers/user.router');
const habitRouter = require('./src/routers/habit.router');

require('./src/db/mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/habits', habitRouter);



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
