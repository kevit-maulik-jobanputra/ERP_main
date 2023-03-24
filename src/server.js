const App = require('./app');
const UserRouter = require('./components/users/users.routes');
const BatchRouter = require('./components/batches/batches.routes');
const StudentRouter= require('./components/students/students.routes')

const app = new App([new UserRouter(), new BatchRouter(), new StudentRouter()]);

app.listen();