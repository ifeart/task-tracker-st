import { Component, inject, OnInit } from '@angular/core';
import { CardTaskComponent } from "../../components/card-task/card-task.component";
import { ActivatedRoute } from '@angular/router';
import { TaskDbService } from '../../data/services/task-db.service';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicTitleService } from '../../data/services/dynamic-title.service';

@Component({
  selector: 'app-task-setting-page',
  standalone: true,
  imports: [CardTaskComponent, TranslateModule],
  templateUrl: './task-setting-page.component.html',
  styleUrl: './task-setting-page.component.scss'
})
export class TaskSettingPageComponent {
  taskService = inject(TaskDbService);
  taskId: number = Number(inject(ActivatedRoute).snapshot.params['id']);
  dynamicTitleService = inject(DynamicTitleService);

  ngOnInit() {
    this.dynamicTitleService.setTitle('DYNAMIC_TITLE.TASK_SETTING_PAGE');
  }
}
