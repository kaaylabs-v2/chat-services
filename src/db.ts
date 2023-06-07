/*import mongoose, { ConnectOptions } from 'mongoose';

const url = 'mongodb://localhost:27017/chatApp';

export const connect = (): void => {
  const options: ConnectOptions = {
    dbName: '',
    user: '',
    pass: '',
    autoIndex: true,
    autoCreate: true
  };

  mongoose.connect(url, options)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
    });
};

export const close = (): void => {
  mongoose.connection.close();
};
*/
import mongoose, { ConnectOptions } from 'mongoose';

const dbUri = 'mongodb://210.18.157.101:27017';

const connect = (callback: (error: Error | null) => void) => {
  const options: ConnectOptions = {
    dbName: 'chat-app',
    user: 'root',
    pass: 'password',
    autoIndex: true,
    autoCreate: true
  };

  mongoose.connect(dbUri, options, (error) => {
    if (error) {
      console.error('Failed to connect to MongoDB:', error);
      callback(error);
    } else {
      console.log('Connected to MongoDB');
      callback(null);
    }
  });
};

const close = () => {
  mongoose.connection.close();
};

export { connect, close };





