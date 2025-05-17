import express, { type NextFunction, type Request, type Response } from 'express';
import router from './src/routes/routes';
import errorHandler from './src/lib/errorHandler';


const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use("/api/v1", router);


app.use((err:unknown, req:Request, res:Response, next:NextFunction) => {
    errorHandler(err, req, res, next);
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));