import express, { urlencoded } from 'express';
import routes from './routes/index.routes'
const app = express();

app.use(urlencoded({ extended: true }))
app.use(express.json());
app.use('/api', routes)

app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
})