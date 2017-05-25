export namespace TodoForm {
    export interface AddTodoForm {
        text: string;
        date?: string;
    }

    export interface UpdateTodoForm {
        id: string;
        text?: string;
        done?: boolean;
        date: string;
    }
}
