export interface FCMNotification {
    to: string;
    notification: FCMNotification.AndroidNotification|FCMNotification.IOSNotification|FCMNotification.WebNotification;
}

export namespace FCMNotification {
    interface BaseNotification {
        title: string;
        body: string;
    }

    export interface AndroidNotification extends BaseNotification {
        sound?: string;
        tag?: string;
    }

    export interface IOSNotification extends BaseNotification {
        sound?: string;
        badge?: string;
    }

    export interface WebNotification extends BaseNotification {
        icon?: string;
    }
}
