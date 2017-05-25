var admin = require('firebase-admin');
const serviceAccount = require("../../cp-todo-firebase-adminsdk-vi744-07dfd31add.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cp-todo.firebaseio.com/"
});

class AuthenticationService {
    private firebaseAuth = admin.auth();

    public authenticate(): void {
    }
}
export default new AuthenticationService();
