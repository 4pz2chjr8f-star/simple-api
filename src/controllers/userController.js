import User from "..src/models/user.js";

export async function getUsers(req, res) {
  try {
    const user = await User.find();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
