import {Router, Request, Response, NextFunction} from 'express';    // NextFunction is for url slug
import FirebaseService from '../services/firebaseService';
import NotificationService from '../services/notificationService';

export class NotificationRouter {
    private _notificationRouter: Router;

    get notificationRouter() {
        return this._notificationRouter;
    }

    constructor() {
        this._notificationRouter = Router();
        this.wire();
    }

    public saveFCMToken(req: Request, res: Response, next: NextFunction): void {
        var fcmToken = <string>req.body.token;

        // TODO: establish fcm_token <-> account relationship
        // FirebaseService.saveFCMToken(req.body.token)
        //     .then(token => {
        //         res.status(200)
        //             .send('Token saved.');
        //     });

        NotificationService.push(fcmToken, (status, val) => {
            res.status(status)
                .send(val);
        })
    }

    private wire(): void {
        this._notificationRouter.post('/fcm_token', this.saveFCMToken);
    }
}

const notificationRouter = new NotificationRouter();
export default notificationRouter.notificationRouter;
