import User from "../models/User.js";

export async function getUsers(req, res, next) {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).end();
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
