import { Component, inject, signal } from '@angular/core';
import { Task } from '../../data/interfaces/task.interface';
import { TaskDbService } from '../../data/services/task-db.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CardTaskComponent } from '../../components/card-task/card-task.component';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DynamicTitleService } from '../../data/services/dynamic-title.service';

@Component({
  selector: 'app-today-page',
  standalone: true,
  imports: [RouterLink, TranslateModule, CardTaskComponent, AsyncPipe],
  templateUrl: './today-page.component.html',
  styleUrl: './today-page.component.scss'
})
export class TodayPageComponent {
  dynamicTitleService = inject(DynamicTitleService);
  taskService = inject(TaskDbService);
  switchMonthSignal = signal<boolean>(false);

  tasksToday$: Observable<Task[]> = this.taskService.getTodayTasks();
  tasksWeek$: Observable<Task[]> = this.taskService.getTasksWeek();
  tasksMonth$: Observable<Task[]> = this.taskService.getTasksMonth();

  ngOnInit() {
    this.dynamicTitleService.setTitle('DYNAMIC_TITLE.TODAY_PAGE');
  }
}
