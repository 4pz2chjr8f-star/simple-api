import User from "../models/User.js";

export async function getUsers(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Math.min(Number(req.query.limit) || 10, 100);

    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);

    res.json({ data: users });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const user = await User.create(req.body);

    res.status(201).json({ data: user });
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

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { name, email } = req.body;

    if (name === undefined || email === undefined) {
      return res
        .status(400)
        .json({ message: "PUT require both name and email" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function patchUser(req, res, next) {
  try {
    const allowedFields = ["name", "email"];

    const fields = Object.keys(req.body);

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ message: "PATCH require at least one field" });
    }

    const invalidFields = fields.filter(
      (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
      return res
        .status(400)
        .json({ message: "Invalid fields", fields: invalidFields });
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    res.json({ data: user });
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
