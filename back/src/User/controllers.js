const jwt = require("jsonwebtoken");
const privateRoute = require("../../utils/privateRoute");
const bcrypt = require("bcryptjs");

const { User } = require("../../database");

module.exports = (app) => {
  //REGISTER USER
  app.post("/users", async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      const user = await User.findOne({ email });

      if (user) {
        throw new Error("Já existe um usuário cadastrado com esse email.");
      }

      const hashedPassword = await bcrypt.hashSync(password, 8);

      new User({
        name,
        email,
        password: hashedPassword,
      }).save();

      return res
        .status(201)
        .json({ success: true, message: "User successfully created!" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  //UPDATE USER
  app.put("/users", async (req, res, next) => {
    try {
      const { password, name } = req.body;
      const token = req.headers["x-access-token"];

      if (!token) {
        throw new Error("Token inválido ou faltando.");
      }

      await jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
          throw new Error("Falha ao autenticar token.");
        }

        const toEdit = { name };

        if (password) {
          const hashedPassword = await bcrypt.hashSync(password, 8);
          toEdit.password = hashedPassword;
        }

        const user = await User.updateOne({ id: decoded.id }, toEdit);
        if (!user) throw new Error("Usuário não encontrado.");

        return res
          .status(200)
          .json({ success: true, message: "Usuário atualizado com sucesso!" });
      });

      throw new Error("Atualização inválida");
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  //LOGIN
  app.post("/users/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) throw new Error("Usuário não encontrado.");
      const passwordVerification = await bcrypt.compareSync(
        password,
        user.password
      );

      if (email === user.email && passwordVerification) {
        const id = user._id;

        const token = jwt.sign({ id }, process.env.SECRET, {
          expiresIn: 86400,
        });
        return res.json({ success: true, token, email, name: user.name });
      }
      throw new Error("Login inválido");
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  //DELETE
  app.delete("/users", async (req, res, next) => {
    try {
      const token = req.headers["x-access-token"];

      if (!token) {
        throw new Error("Token inválido ou faltando.");
      }

      await jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
          throw new Error("Falha ao autenticar token.");
        }

        await User.deleteOne({ _id: decoded.id });

        return res
          .status(200)
          .json({ success: true, message: "Usuário deletado com sucesso!" });
      });

      throw new Error("Atualização inválida");
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
};
