const express = require("express");
const app = express();

const { calculateIVFSuccess } = require("./api/ivf_calculator");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.post("/ivf_calculator", async (req, res) => {
  console.log(req.body);
  
  const result = await calculateIVFSuccess(req.body);
  res.send(result);
});

app.listen(3001, () => {
  console.log("App started on port 3001");
});