const express = require("express");
const { Todo } = require("../mongo");
const { getAsync, setAsync } = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const added_todos = await getAsync("added_todos");

  if (added_todos) {
    await setAsync("added_todos", Number(added_todos) + 1);
  } else {
    await setAsync("added_todos", 1);
  }

  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  const todo = req.todo;
  if (todo) {
    return res.json(todo);
  }

  res.sendStatus(405);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const todo = req.body;

  const newTodo = await Todo.findByIdAndUpdate(
    req.todo._id,
    { ...todo },
    {
      new: true,
      useFindAndModify: false,
    }
  );

  if (newTodo) {
    return res.json(newTodo);
  }

  res.sendStatus(405); // Implement this
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
