import { Component, inject, OnInit } from '@angular/core';
import { DynamicTitleService } from '../../data/services/dynamic-title.service';
import { CardTaskComponent } from '../../components/card-task/card-task.component';
import { TaskDbService } from '../../data/services/task-db.service';
import { Task } from '../../data/interfaces/task.interface';
import { TranslateModule } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CardTaskComponent, TranslateModule, AsyncPipe, RouterLink],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  dynamicTitleService = inject(DynamicTitleService);
  taskService = inject(TaskDbService);
  

  tasks$: Observable<Task[]> = this.taskService.getTasks();
  todayTasks$: Observable<Task[]> = this.taskService.getTodayTasks();
  
  ngOnInit(): void {
    this.dynamicTitleService.setTitle('DYNAMIC_TITLE.MAIN_PAGE');
  }
}
