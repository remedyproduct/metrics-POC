require("newrelic");

import express from "express";

const PORT = 5000;
const app = express();

const GOODS: Record<string, Record<number, string>> = {
  CARS: { 1: "Audi", 2: "Ferrari", 3: "Volvo", 4: "BMW" },
  TOYS: { 1: "Hasbro", 2: "Barbie", 3: "LEGO" },
};

app.get("/goods", (req, res) => {
  const type = String(req.query.type);
  if (!Object.keys(GOODS).includes(type)) {
    res.status(400).send("Unknown type");
  }
  return res.send(Object.values(GOODS[type]));
});

app.get("/health", (req, res) => {
  return res.send({ status: true });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
