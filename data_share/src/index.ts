import express from 'express';
import router from './data-share.route';
import { DatabaseAdapter, PORT } from './infrastructure/database.adapter';
import bodyParser from 'body-parser';
import { EventRegister } from './event';

EventRegister.register();

DatabaseAdapter.connect();
const app = express();

app.use(bodyParser.json());
app.use(router);

app.listen(PORT, () => {
    console.log('Service SHARE DATA start SUCCESS!!!');
});
