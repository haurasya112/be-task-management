import { Sequelize } from 'sequelize';

const db = new Sequelize('task_management','root','Surakarta2002',{
    host:"localhost",
    dialect:"mysql"
});

export default db;