import { Sequelize } from 'sequelize';
import db from '../config/database.js';
import Users from './user.model.js';

const { DataTypes } = Sequelize;

const Task = db.define('tasks', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'To Do',
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'Medium',
  },
  due_date: {
    type: DataTypes.DATE,
  },
  attachment: {
    type: DataTypes.STRING,
  }
}, {
  freezeTableName: true,
});

Task.belongsTo(Users, { foreignKey: 'user_id' });

export default Task;