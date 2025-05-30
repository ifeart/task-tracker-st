import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Task } from '../../data/interfaces/task.interface';
import { TaskDbService } from '../../data/services/task-db.service';
import { CardTaskComponent } from '../../components/card-task/card-task.component';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DynamicTitleService } from '../../data/services/dynamic-title.service';

@Component({
  selector: 'app-week-tasks-page',
  standalone: true,
  imports: [TranslateModule, CardTaskComponent, AsyncPipe],
  templateUrl: './week-tasks-page.component.html',
  styleUrl: './week-tasks-page.component.scss'
})
export class WeekTasksPageComponent {
  dynamicTitleService = inject(DynamicTitleService);
  switchMonthSignal = signal<boolean>(false);
  taskService = inject(TaskDbService);

  tasksToday$: Observable<Task[]> = this.taskService.getTodayTasks();
  tasksWeek$: Observable<Task[]> = this.taskService.getTasksWeek();
  tasksMonth$: Observable<Task[]> = this.taskService.getTasksMonth();

  ngOnInit() {
    this.dynamicTitleService.setTitle('DYNAMIC_TITLE.WEEK_TASKS_PAGE');
  }
}
