import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../utils/database.util';

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export const User = sequelize.define<IUserInstance>(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }
);

interface IUserCreationAttributes extends Optional<IUser, 'id'> {
}

interface IUserInstance extends Model<IUser, IUserCreationAttributes>, IUser {
}

export default IUserInstance;
