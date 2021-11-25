const jwt = require("jsonwebtoken");
const privateRoute = require("../../utils/privateRoute");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const { User, IoT } = require("../../database");

module.exports = (app) => {
  //CREATE IOT
  app.post("/iot", privateRoute, async (req, res, next) => {
    try {
      const { userId, body } = req;
      const { name, description, category, trigger, actionRoute } = body;

      const user = await User.findOne({ _id: userId });

      if (!user) throw new Error("Usuário não encontrado.");
      const newIot = await new IoT({
        name,
        description,
        category,
        trigger,
        actionRoute,
        belongsTo: user,
      }).save();

      user.iots.push(newIot);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "IoT criado com sucesso!",
        data: { safeCode: newIot.safeCode, id: newIot._id },
      });
    } catch (err) {
      console.log("mess >>>", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  //UPDATE IOT
  app.put("/iot/:id", privateRoute, async (req, res, next) => {
    try {
      const { name, description, trigger, category, actionRoute } = req.body;
      const { id } = req.params;

      const user = await User.findOne({ _id: req.userId });

      if (!user) throw new Error("Usuário não encontrado.");

      const iots = user.iots;

      let filteredIot = iots.filter((item) => {
        return item.toString() === id;
      });

      if (filteredIot.length === 0) throw new Error("Iot não encontrado.");

      filteredIot = filteredIot[0];

      await IoT.findByIdAndUpdate(
        { _id: filteredIot.toString() },
        {
          ...filteredIot,
          name,
          description,
          trigger,
          category,
          actionRoute,
        }
      );

      return res
        .status(200)
        .json({ success: true, message: "IoT atualizado com sucesso!" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  //INSERT DATA ON IOT
  app.post("/iot/data/:id", async (req, res, next) => {
    try {
      const { body, params } = req;
      const { value, secret } = body;
      const { id } = params;

      const iot = await IoT.findOne({ _id: id });

      if (!iot) throw new Error("IoT não existe!");

      if (secret !== iot.safeCode) throw new Error("Não autorizado!");

      const obj = { value, date: new Date().toISOString() };

      if (iot.trigger !== "") {
        if (eval(`${value} ${iot.trigger}`)) {
          await axios.post(iot.actionRoute, obj);
        }
      }

      iot.data.push(obj);

      await iot.save();

      return res
        .status(200)
        .json({ success: true, message: "Dado inserido com sucesso!" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  //GET ALL IOT FROM USER
  app.get("/iot", privateRoute, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.userId });

      if (!user) throw new Error("Usuário não encontrado.");

      const iots = user.iots;
      const arrayOfIots = [];

      await Promise.all(
        iots.map(async (item) => {
          arrayOfIots.push(await IoT.findOne({ _id: item.toString() }));
        })
      );

      return res.status(200).json({ sucess: true, data: arrayOfIots });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  });

  //GET ONE IOT FROM USER
  app.get("/iot/:id", privateRoute, async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: req.userId });

      if (!user) throw new Error("Usuário não encontrado.");

      const iots = user.iots;

      const filteredIot = iots.filter((item) => {
        return item.toString() === id;
      });

      if (filteredIot.length === 0) throw new Error("Iot não encontrado.");

      const iot = await IoT.findOne({ _id: filteredIot[0].toString() });

      return res.status(200).json({ sucess: true, data: iot });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  });

  //DELETE ONE IOT FROM USER
  app.delete("/iot/:id", privateRoute, async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: req.userId });

      if (!user) throw new Error("Usuário não encontrado.");

      const iots = user.iots;

      const filteredIot = iots.filter((item) => {
        return item.toString() === id;
      });

      if (filteredIot.length === 0) throw new Error("Iot não encontrado.");

      await IoT.findOneAndDelete({
        _id: filteredIot[0].toString(),
      });

      user.iots = user.iots.filter((item) => {
        return item.toString() !== id;
      });

      user.save();

      return res
        .status(200)
        .json({ sucess: true, message: "Deleção realizada com sucesso!" });
    } catch (err) {
      return res.status(500).json({ error: true, message: err.message });
    }
  });
};
