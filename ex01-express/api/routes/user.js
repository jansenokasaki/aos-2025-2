import { Router } from "express";
import { Sequelize } from "sequelize";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const listaUsuarios = await req.context.models.User.findAll({
      attributes: ["id", "username", "email"],
      include: [
        {
          model: req.context.models.Message,
          attributes: ["id", "text", "createdAt"],
        },
      ],
    });
    return res.status(200).json(listaUsuarios);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const usuarioEncontrado = await req.context.models.User.findByPk(req.params.userId, {
      attributes: ["id", "username", "email"],
      include: [
        {
          model: req.context.models.Message,
          attributes: ["id", "text", "createdAt"],
        },
      ],
    });
    if (!usuarioEncontrado) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    return res.status(200).json(usuarioEncontrado);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ erro: "Username e email são obrigatórios" });
    }
    const usuarioCriado = await req.context.models.User.create({ username, email });
    return res.status(201).json(usuarioCriado);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao criar usuário" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { username, email } = req.body;
    const usuarioAlvo = await req.context.models.User.findByPk(req.params.userId);
    if (!usuarioAlvo) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    await usuarioAlvo.update({ username, email });
    return res.status(200).json(usuarioAlvo);
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao atualizar usuário" });
  }
});

router.delete("/:userId", async (req, res) => {
  try {
    const usuarioParaRemover = await req.context.models.User.findByPk(req.params.userId);
    if (!usuarioParaRemover) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    await usuarioParaRemover.destroy();
    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao deletar usuário" });
  }
});

export default router;