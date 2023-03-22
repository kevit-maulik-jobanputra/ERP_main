const App = require('./app');
const UserRouter = require('./components/users/user.routes');

const app = new App([new UserRouter()]);

app.listen();