'use strict';
debugger;

const dayjs = require('dayjs');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function main() {
    class Task {
        constructor(id, description, deadline = null, isUrgent = true, isPrivate = false) {
            this.id = id;
            this.description = description;
            if (deadline === null || dayjs.isDayjs(deadline))
                this.deadline = deadline;
            this.isPrivate = isPrivate;
            this.isUrgent = isUrgent;

            this.toString = () => `Id: ${this.id}, Description: ${this.description}, IsUrgent: ${this.isUrgent}, IsPrivate: ${this.isPrivate}, Deadline: ${this.deadline?.toString()}`;
        }

        static fromMap(taskMap) {
            let id = taskMap['id'];
            let description = taskMap['description'];

            let deadline = taskMap['deadline'];
            deadline = (!deadline) ? null : dayjs(deadline);

            let isUrgent = taskMap['urgent'] === 0 ? false : true;
            let isPrivate = taskMap['private'] === 0 ? false : true;

            if (!id || !description)
                throw `invalid id or description: id: ${id}, description: ${description}`

            return new Task(id, description, deadline, isUrgent, isPrivate);
        };
    }

    function TaskList() {
        this.tasks = [];

        this.addTask = (t) => {
            this.tasks.push(t);
        };

        this.sortAndPrint = () => {
            this.tasks
                .sort((a, b) => {
                    if (b.deadline === null)
                        return -1
                    if (a.deadline === null)
                        return 1
                    return a.deadline.isAfter(b.deadline) ? 1 : -1;
                })

            this.tasks
                .forEach((t) => console.log(t.toString()));
        };

        this.filterAndPrint = () => {
            this.tasks
                .filter((t) => t.isUrgent === true)
                .forEach((t) => console.log(t.toString()));
        };
    }

    async function loadAllTasksFromDB(dbRef) {
        let taskList = new TaskList();
        await dbRef.each("SELECT * FROM tasks", (err, row) => {
            if (err) {
                throw err;
            }
            taskList.addTask(Task.fromMap(row));
        });
        return taskList;
    }

    async function loadTasksAfterDateFromDB(dbRef, date) {
        let taskList = new TaskList();
        await dbRef.each(
            "SELECT * FROM tasks WHERE deadline > $0",
            [date.toISOString()],
            (err, row) => {
                if (err) {
                    throw err;
                }
                taskList.addTask(Task.fromMap(row));
            });
        return taskList;
    }

    async function loadTasksContainingTextFromDB(dbRef, text) {
        let taskList = new TaskList();
        await dbRef.each(
            "SELECT * FROM tasks WHERE description LIKE '%'||$0||'%'",
            [text],
            (err, row) => {
                if (err) {
                    throw err;
                }
                taskList.addTask(Task.fromMap(row));
            });
        return taskList;
    }

    const tasksDB = await sqlite.open({
        filename: 'tasks.db',
        driver: sqlite3.Database
    });

    loadAllTasksFromDB(tasksDB)
        .then((t, _) => console.log(t.sortAndPrint()));
    loadTasksAfterDateFromDB(tasksDB, dayjs("2021-01-12T16:00:00.000Z"))
        .then((t, _) => console.log(t.sortAndPrint()));
    loadTasksContainingTextFromDB(tasksDB, "phone")
        .then((t, _) => console.log(t.sortAndPrint()));

    tasksDB.close();
}

main();