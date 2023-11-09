const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());

morgan.token("post_data", (req) => {
  return req.method === "POST" ? ` ${JSON.stringify(req.body)}` : "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms:post_data"
  )
);

const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
        `
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) res.json(person);
  else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  let id = 1;
  while (persons.find((person) => person.id === id)) {
    id = Math.floor(Math.random() * 100);
  }
  return id;
};

const validPerson = (name, number) => {
  if (!name || !number) {
    return [false, "content missing"];
  }
  if (persons.find((person) => person.name === name)) {
    return [false, "name must be unique"];
  }
  return [true, ""];
};

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  const [valid, msg] = validPerson(name, number);

  if (!valid) {
    return res.status(400).json({
      error: msg,
    });
  }

  const person = {
    id: generateId(),
    name: name,
    number: number,
  };

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
