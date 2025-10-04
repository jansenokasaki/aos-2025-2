import { v4 as uuidv4 } from "uuid";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const messages = await req.context.models.Task.findAll();
    return res.send(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:taskId", async (req, res) => {
  try {
    const message = await req.context.models.Message.findByPk(req.params.messageId);
    if (!message) {
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    return res.send(message);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {

  

    // Use o ID do usuário autenticado ao invés do userId do body
    
    const taskData = {
      id: uuidv4(),
      descricao: req.body.descrocao,
    };

    const task = await req.context.models.Task.create(taskData);

    return res.send(task);
  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: error.task });
  }
});

router.delete("/:taskId", async (req, res) => {
  try {
    const task = await req.context.models.Task.findByPk(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: "tarefa não encontrada" });
    }

    await task.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;