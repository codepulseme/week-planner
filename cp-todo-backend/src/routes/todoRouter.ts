import {Router, Request, Response, NextFunction} from 'express';    // NextFunction is for url slug
import FirebaseService from '../services/firebaseService';
import {TodoForm} from "./forms/todoForms";

export class TodoRouter {
    private todoRouter: Router;

    constructor() {
        this.todoRouter = Router();
        this.wire();
    }

    /**
     * This method is invoked by both PUT and POST
     */
    public setTodo(req: Request, res: Response, next: NextFunction): void {
        FirebaseService.updateTodo(req.body)
            .then(() => {
                var msg = 'TODO updated.';
                console.log(msg);
                res.status(200)
                    .send(msg);
            })
            .catch((err) => {
                var errMsg = 'An error occurred while saving TODO: ' + (<Error>err).message;
                console.error(errMsg);
                res.status(400)
                    .send(errMsg);
            });
    }

    public addTodo(req: Request, res: Response, next: NextFunction): void {
        let addTodoForm = <TodoForm.AddTodoForm>req.body;
        FirebaseService.addTodo(addTodoForm)
            .then(() => {
                res.status(200)
                    .send('Todo added.');
            })
            .catch((err) => {
                res.status(400)
                    .send('An error occurred while adding TODO: ' + (<Error>err).message);
            })
    }

    public getTodoList(req: Request, res: Response, next: NextFunction): void {
        const params = req.params;
        if (params.hasOwnProperty('date')) {
            FirebaseService.getTodoList(<string>params['date'])
                .then((jsonArr) => {
                    console.log('Json array retrieved: ', jsonArr);
                    res.status(200)
                        .header('Content-Type', 'application/json')
                        .json(jsonArr);
                })
                .catch((err) => {
                    var errMsg = "An error occurred while retrieving TODO list: " + (<Error>err).message;
                    console.error(errMsg);
                    res.status(400)
                        .send(errMsg);
                });
        } else {
            res.status(400)
                .send("'Date' param must be specified!");
        }
    }

    public getAll(req: Request, res: Response, next: NextFunction): void {
        FirebaseService.getAll()
            .then(metaList => {
                res.status(200)
                    .json(metaList);
            })
            .catch(err => {
                var errMsg = 'An error occurred while reading the meta list: ' + (<Error>err).message;
                console.error(errMsg);
                res.status(400)
                    .send(errMsg);
            })
    }

    public removeTodo(req: Request, res: Response, next: NextFunction): void {
        let date = <string>req.params.date;
        let id = <string>req.params.id;
        FirebaseService.removeTodo(id, date)
            .then(() => {
                res.status(202)
                    .send('Todo removed.');
            })
            .catch(err => {
                res.status(400)
                    .send('An error occurred while deleting todo: ' + (<Error>err).message);
            });
    }

    private wire(): void {
        this.todoRouter.post('/', this.addTodo);
        this.todoRouter.get('/:date', this.getTodoList);
        this.todoRouter.put('/', this.setTodo);
        this.todoRouter.get('/', this.getAll);
        this.todoRouter.delete('/:date/:id', this.removeTodo);
    }

    get router() {
        return this.todoRouter;
    }
}
const todoRouter = new TodoRouter();
export default todoRouter.router;
