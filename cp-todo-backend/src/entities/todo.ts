var shortid = require('shortid');

export class Todo {
    // Fuck TS getters and setters they are fucking gay
    public date: string;
    public text: string;
    public done: boolean;
    public id: string;

    constructor() {
        this.done = false;
        this.id = shortid.generate();
    }

    static from(text: string, date: string): Todo {
        var todo: Todo = new Todo();
        todo.text = text;
        todo.date = date;
        return todo;
    }
}
