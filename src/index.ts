import express from 'express';
import auth from './routes/auth';
import envConfig from "./config/env";
import index from './routes';

envConfig();
const port = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({extended: true , limit: "2mb"}))
app.use(express.json())

app.use('/', express.static('./wwwroot'))
app.use("/api", index)
app.use("/api/auth", auth)

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
