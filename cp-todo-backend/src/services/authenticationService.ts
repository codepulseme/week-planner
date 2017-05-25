var admin = require('firebase-admin');
const firebaseConfigs = require('../../config.json')[process.env.NODE_ENV || 'dev']['firebase'];
const serviceAccount = require("../../".concat(firebaseConfigs['admin-sdk']));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfigs['databaseURL']
});

class AuthenticationService {
    private firebaseAuth = admin.auth();

    public authenticate(): void {
    }
}
export default new AuthenticationService();
