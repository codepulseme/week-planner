var fcmConfigs = require('../../config.json')[process.env.NODE_ENV || 'dev']['firebase']['fcm'];
import {FCMNotification} from "../models/fcmNotification";
var request = require('request');

class NotificationService {
    public push(fcmToken: string, callback: Function): void {
        // TODO: set title and body according to notification type
        var notification: FCMNotification.WebNotification = {
            title: "Test Title",
            body: "This is a test from the TODO backend"
        };

        var fcmNotification: FCMNotification = {
            to: fcmToken,
            notification: notification
        };

        var fcmNotificationJson = JSON.stringify(fcmNotification);

        var options = {
            method: 'POST',
            body: fcmNotificationJson,
            headers: {
                'Authorization': 'key=' + fcmConfigs.serverKey,
                'Content-Type': 'application/json',
            }
        };

        request.post(fcmConfigs.url, options, (err, res, body) => {
            if (err) {
                callback(400, err);
            } else {
                callback(200, body);
            }
        });
    }
}

export default new NotificationService();
