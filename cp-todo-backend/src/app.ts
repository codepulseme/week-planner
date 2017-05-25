/**
 * Created by anthelion on 03/05/2017.
 */
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import TodoRouter from './routes/todoRouter';
import NotificationRouter from './routes/notificationRouter';

/** Where express is set up */
class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        // this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    private routes(): void {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                message: 'N/A'
            });
        });

        this.express.use('/', router);
        this.express.use('/api/v1/todo', TodoRouter);
        this.express.use('/api/v1/notification', NotificationRouter);
    }
}

export default new App().express;
