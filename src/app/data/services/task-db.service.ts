import { inject, Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable, BehaviorSubject, tap } from 'rxjs';
import { Task } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskDbService {
  private storeName = 'tasks';
  private dbService = inject(NgxIndexedDBService);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.dbService.getAll<Task>(this.storeName).pipe(
      map((tasks) => tasks.sort((a, b) => a.deadline.getTime() - b.deadline.getTime()))
    ).subscribe((tasks) => {
      this.tasksSubject.next(tasks);
    });
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): Observable<Task> {
    const taskWithMeta = {
      ...task,
      createdAt: new Date(),
      deadline: task.deadline ? new Date(task.deadline) : task.deadline
    };

    return this.dbService.add(this.storeName, taskWithMeta).pipe(
      tap(() => this.loadTasks())
    );
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTasksWeek(): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((task) => task.deadline && new Date(task.deadline) >= new Date() && new Date(task.deadline) <= new Date(new Date().setDate(new Date().getDate() + 7)))
      )
    );
  }

  getTasksMonth(): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => tasks.filter((task) => task.deadline && new Date(task.deadline) >= new Date() && new Date(task.deadline) <= new Date(new Date().setDate(new Date().getDate() + 30)))
      )
    );
  }

  getTodayTasks(): Observable<Task[]> {
    return this.tasks$.pipe(
      map((tasks) => {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        
        return tasks.filter((task) => {
          if (!task.deadline) return false;
          const taskDate = new Date(task.deadline);
          return taskDate >= startOfDay && taskDate <= endOfDay;
        });
      })
    );
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map((tasks) => tasks.find(task => task.id === id))
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.dbService.update(this.storeName, task).pipe(
      tap(() => this.loadTasks())
    );
  }

  deleteTask(id: number): Observable<any> {
    return this.dbService.delete(this.storeName, id).pipe(
      tap(() => this.loadTasks())
    );
  }
}
