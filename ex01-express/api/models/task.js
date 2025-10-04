const getTaskModel = (sequelize, { DataTypes }) => {
  const Task = sequelize.define("task", {
    objectId: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },    

    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },

     concluida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return Task;
};

export default getTaskModel;