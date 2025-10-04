const getTaskModel = (sequelize, { DataTypes }) => {
  const Task = sequelize.define("task", {
    objectId: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },    

    descricao: {
      type: DataTypes.STRING,
    },

     concluida: {
      type: DataTypes.BOOLEAN,
    },
  });

  return Task;
};

export default getTaskModel;