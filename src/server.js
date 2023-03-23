const App = require('./app');
const UserRouter = require('./components/users/users.routes');

const app = new App([new UserRouter()]);

app.listen();