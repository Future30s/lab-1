'use strict';
debugger;

const dayjs = require('dayjs');

function Task(id, description, deadline = null, isUrgent = true, isPrivate = false) {
    this.id = id;
    this.description = description;
    if (deadline === null || dayjs.isDayjs(deadline))
        this.deadline = deadline;
    this.isPrivate = isPrivate;
    this.isUrgent = isUrgent;

    this.toString = () => `Id: ${this.id}, Description: ${this.description}, IsUrgent: ${this.isUrgent}, IsPrivate: ${this.isPrivate}, Deadline: ${this.deadline?.toString()}`;
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

let t1 = new Task(1, "Spesa", dayjs("2021-03-10T10:00:00.000Z"), false);
let t2 = new Task(2, "Meccanico", dayjs("2021-03-11T13:00:00.000Z"));
let t3 = new Task(3, "Cavallo", dayjs("2021-03-12T16:00:00.000Z"));

let taskList = new TaskList();

taskList.addTask(t1);
taskList.addTask(t2);
taskList.addTask(t3);

console.log("****** Tasks sorted by deadline (most recent first): ******");
taskList.sortAndPrint();
console.log("\n");
console.log("****** Tasks filtered, only (urgent == true): ******");
taskList.filterAndPrint();
