const getTaskModel = (sequelize, { DataTypes }) => {
  const Task = sequelize.define("task", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User);
  };

  return Task;
};

export default getTaskModel;
