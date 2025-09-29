import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const listaMensagens = await req.context.models.Message.findAll();
    return res.send(listaMensagens);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.get("/:messageId", async (req, res) => {
  try {
    const mensagemEncontrada = await req.context.models.Message.findByPk(req.params.messageId);
    if (!mensagemEncontrada) {
      return res.status(404).json({ erro: "Mensagem não encontrada" });
    }
    return res.send(mensagemEncontrada);
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.context.me:", req.context.me);
    if (!req.context.me) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }
    if (!req.body.text) {
      return res.status(400).json({ erro: "Texto da mensagem é obrigatório" });
    }

    const idUsuario = req.context.me.id;
    console.log("idUsuario type:", typeof idUsuario, "value:", idUsuario);
    
    const dadosMensagem = {
      text: req.body.text,
      userId: idUsuario,
    };
    console.log("dadosMensagem:", dadosMensagem);

    const novaMensagem = await req.context.models.Message.create(dadosMensagem);

    return res.send(novaMensagem);
  } catch (erro) {
    console.error("Erro:", erro);
    return res.status(500).json({ erro: erro.message });
  }
});

router.put("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ erro: "O campo 'text' é obrigatório e deve ser uma string não vazia" });
    }

    if (!req.context.me) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    const mensagemEncontrada = await req.context.models.Message.findByPk(messageId);
    if (!mensagemEncontrada) {
      return res.status(404).json({ erro: "Mensagem não encontrada" });
    }

    if (mensagemEncontrada.userId !== req.context.me.id) {
      return res.status(403).json({ erro: "Você não tem permissão para editar esta mensagem" });
    }

    await mensagemEncontrada.update({ text });

    return res.status(200).json({ mensagem: mensagemEncontrada });
  } catch (erro) {
    console.error("Erro ao atualizar mensagem:", erro);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
});

router.delete("/:messageId", async (req, res) => {
  try {
    const mensagemParaExcluir = await req.context.models.Message.findByPk(req.params.messageId);
    if (!mensagemParaExcluir) {
      return res.status(404).json({ erro: "Mensagem não encontrada" });
    }

    await mensagemParaExcluir.destroy();
    return res.status(204).send();
  } catch (erro) {
    return res.status(500).json({ erro: erro.message });
  }
});

export default router;