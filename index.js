var express = require('express'),
  cors = require('cors'),
  app = express(),
  port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.post('/event', (req, res) => {
    var body = req.body;
    console.log(body);
    res.send({ "xxx": "yyy"});
  })
  
  app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
  })