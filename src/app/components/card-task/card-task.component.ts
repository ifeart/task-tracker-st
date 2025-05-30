import { AfterViewInit, Component, ElementRef, inject, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Task } from '../../data/interfaces/task.interface';
import { DatePipe } from '@angular/common';
import { TaskDbService } from '../../data/services/task-db.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../data/services/toast.service';

declare var M: any;

@Component({
  selector: 'app-card-task',
  standalone: true,
  imports: [DatePipe, TranslateModule, RouterLink],
  templateUrl: './card-task.component.html',
  styleUrl: './card-task.component.scss'
})
export class CardTaskComponent implements OnInit, AfterViewInit {
  taskService = inject(TaskDbService);
  toastService = inject(ToastService);
  @Input() taskId!: number;
  @ViewChildren('tooltipElement', { read: ElementRef }) tooltipElements!: QueryList<ElementRef>;

  task: Task | undefined;

  ngOnInit() {
    this.taskService.getTaskById(this.taskId).subscribe((task) => {
      this.task = task;
      console.log(this.task);
    });
  }

  ngAfterViewInit(): void {
    this.initTooltips();
    
    this.tooltipElements.changes.subscribe(() => {
      setTimeout(() => this.initTooltips(), 100);
    });
  }

  private initTooltips(): void {
    setTimeout(() => {
      if (M && M.Tooltip && this.tooltipElements && this.tooltipElements.length > 0) {
        const elements = this.tooltipElements.map(el => el.nativeElement);
        M.Tooltip.init(elements);
      }
    }, 100);
  }

  deleteTask() {
    this.taskService.deleteTask(this.taskId).subscribe(() => {
      this.task = undefined;
      this.toastService.showToast('TASK_DELETED');
    });
  }

  doneTask() {
    this.task!.status = 'completed';
    this.taskService.updateTask(this.task!).subscribe(() => {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.task = task;
        setTimeout(() => this.initTooltips(), 100);
      });
      this.toastService.showToast('TASK_DONE');
    });
  }

  unDoneTask() {
    this.task!.status = 'in-progress';
    this.taskService.updateTask(this.task!).subscribe(() => {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.task = task;
        setTimeout(() => this.initTooltips(), 100);
      });
      this.toastService.showToast('TASK_UNDONE');
    });
  }

  pinTask() {
    this.task!.pinned = !this.task!.pinned;
    this.taskService.updateTask(this.task!).subscribe(() => {
      this.taskService.getTaskById(this.taskId).subscribe((task) => {
        this.task = task;
        setTimeout(() => this.initTooltips(), 100);
      });
    });
  }
}
