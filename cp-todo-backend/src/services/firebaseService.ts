import {BaseDatabase} from "../db/db";
import {Todo} from "../entities/todo";
import {TodoForm} from "../routes/forms/todoForms";
import {DateUtils} from "../utils/dateUtils";
import {isNullOrUndefined} from "util";
var admin = require('firebase-admin');
const firebaseConfigs = require('../../config.json')[process.env.NODE_ENV || 'dev']['firebase'];
const serviceAccount = require("../../".concat(firebaseConfigs['admin-sdk']));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfigs['databaseURL']
});

class FirebaseService implements BaseDatabase {
    private db = admin.database();

    public save<T>(obj: T): Promise<any> {
        var rootRef = this.db.ref();
        return rootRef.set(obj);
    }

    public updateTodo(updateTodoForm: TodoForm.UpdateTodoForm): Promise<any> {
        // TODO: expect device number here to support multiple users
        if (!DateUtils.isDateOfDDmmYYYY(updateTodoForm.date)) {
            return Promise.reject(updateTodoForm.date + ' is not of format DD-MM-YYYY');
        }
        var formattedDate = DateUtils.formatDateStr(updateTodoForm.date, DateUtils.DDMMYYYY_ISO);
        let dateRef = this.db.ref('lists').child(formattedDate);
        let todoRef = dateRef.child(updateTodoForm.id);
        return todoRef.once('value')
            .then((snapshot) => {
                var value = snapshot.val();
                console.log('[FirebaseService] Existing todo: ', value);
                if (value) {
                    let todo: Todo = <Todo>value;
                    let updatedTodo: Todo = new Todo();
                    updatedTodo.text = isNullOrUndefined(updateTodoForm.text) ? todo.text : updateTodoForm.text;
                    updatedTodo.done = isNullOrUndefined(updateTodoForm.done) ? todo.done : updateTodoForm.done;
                    updatedTodo.date = formattedDate;
                    updatedTodo.id = updateTodoForm.id;
                    console.log('[FirebaseService] updated TODO: ', updatedTodo);
                    return todoRef.set(updatedTodo);
                } else {
                    return Promise.reject('Requested TODO item does not exist.');
                }
            })
            .catch(err => {
                return Promise.reject((<Error>err).message);
            });
    }

    /**
     * TODO: should we allow adding a task to a date in the past?
     */
    public addTodo(addTodoForm: TodoForm.AddTodoForm): Promise<any> {
        let date = (addTodoForm.date && DateUtils.isDateOfDDmmYYYY(addTodoForm.date)) ?
            DateUtils.formatDateStr(addTodoForm.date, DateUtils.DDMMYYYY_ISO) : DateUtils.ddMMyyyy('-');
        let todo: Todo = Todo.from(addTodoForm.text, date);
        let dateRef = this.db.ref('/lists').child(date).child(todo.id);
        return dateRef.set(todo);
    }

    /**
     * Get the TodoList of a specific date
     */
    public getTodoList(date: string): Promise<any> {
        console.log('[FirebaseService] Retrieving todo list of date: ' + date);
        let dateRef = this.db.ref('/lists').child(DateUtils.formatDateStr(date, DateUtils.DDMMYYYY_ISO));

        return dateRef.once('value')
            .then(snapshot => {
                var value = snapshot.val();
                if (isNullOrUndefined(value)) return Promise.resolve([]);
                return Promise.resolve(this.todoJsonToArr(JSON.stringify(value)));
            })
            .catch(e => {
                return Promise.reject(e);
            });
    }

    public getAll(): Promise<any> {
        const rootRef = this.db.ref('/lists');
        return rootRef.once('value')
            .then(snapshot => {
                var value = snapshot.val();
                if (isNullOrUndefined(value)) return Promise.resolve([]);
                return Promise.resolve(this.metaJsonToMetaList(value));
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }

    public removeTodo(id: string, date: string): Promise<any> {
        let todoRef = this.db.ref('/lists').child(DateUtils.formatDateStr(date, DateUtils.DDMMYYYY_ISO)).child(id);
        return todoRef.remove();
    }

    public saveFcmToken(token: string): Promise<any> {
        console.log('[FirebaseService] FCM token received: ', token);
        // Each token should be associated with a user
        // A new reg_token should be generated on log-in
        // The associated token should be removed on log-out
        const fcmRef = this.db.ref('/fcm_tokens');
        // return fcmRef.set(token);
        return fcmRef.push(token);
    }

    // Private methods
    private todoJsonToArr(jsonStr: string): any {
        var jsonArr = [];
        var json = JSON.parse(jsonStr);
        console.log('[FirebaseService] Json: ', json);
        // remove null values (shouldn't be needed)
        Object.keys(json).forEach(key => (!json[key] && json[key] !== undefined) && delete json[key]);
        Object.keys(json).forEach(key => jsonArr.push(<Todo>json[key]));
        return jsonArr;
    }

    private metaJsonToMetaList(json: any): any {
        const keys: string[] = Object.keys(json);
        var metaList = [];

        console.log('Keys: ', keys);

        for (let key of keys) {
            console.log('Key: ', key);
            var todoJson = JSON.stringify(json[key]);
            let todoList = this.todoJsonToArr(todoJson);
            console.log('Todo list: ', todoList);
            metaList = metaList.concat(todoList);
        }

        console.log('[FirebaseService] metaList: ', metaList);
        return metaList;
    }
}
const firebaseService = new FirebaseService();
export default firebaseService;
