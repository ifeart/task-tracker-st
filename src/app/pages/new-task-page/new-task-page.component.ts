import { Component, inject, AfterViewInit, ElementRef, ViewChildren, ViewChild, QueryList } from '@angular/core';
import { TaskDbService } from '../../data/services/task-db.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Task } from '../../data/interfaces/task.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../data/services/toast.service';
import { DynamicTitleService } from '../../data/services/dynamic-title.service';

declare const M: any;

@Component({
  selector: 'app-new-task-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './new-task-page.component.html',
  styleUrl: './new-task-page.component.scss'
})
export class NewTaskPageComponent implements AfterViewInit {
  taskService = inject(TaskDbService);
  translateService = inject(TranslateService);
  toastService = inject(ToastService);
  dynamicTitleService = inject(DynamicTitleService);
  @ViewChildren('characterCounter') characterCounterElements!: QueryList<ElementRef>;
  @ViewChild('prioritySelect') prioritySelect!: ElementRef;
  @ViewChild('statusSelect') statusSelect!: ElementRef;
  @ViewChild('datepicker') datepicker!: ElementRef;
  @ViewChild('timepicker') timepicker!: ElementRef;

  newTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(500)]),
    status: new FormControl('pending', [Validators.required, Validators.pattern(/^(pending|in-progress|completed)$/)]),
    deadline: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    deadlineTime: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    priority: new FormControl('low', [Validators.required, Validators.pattern(/^(low|medium|high|critical)$/)]),
    pinned: new FormControl(false, [Validators.required]),
  });

  ngOnInit() {
    this.dynamicTitleService.setTitle('DYNAMIC_TITLE.NEW_TASK_PAGE');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (M && M.CharacterCounter) {
        const inputElements = this.characterCounterElements.map(el => el.nativeElement);
        M.CharacterCounter.init(inputElements);
      }
      
      if (M && M.FormSelect) {
        if (this.prioritySelect) {
          M.FormSelect.init(this.prioritySelect.nativeElement);
        }
        
        if (this.statusSelect) {
          M.FormSelect.init(this.statusSelect.nativeElement);
        }
      }

      if (M && M.Datepicker && this.datepicker) {
        const datepickerOptions = {
          format: 'yyyy-mm-dd',
          autoClose: true,
          showClearBtn: true,
          i18n: null as any
        };

        if (this.translateService.currentLang === 'ru') {
          datepickerOptions.i18n = {
            cancel: 'Отмена',
            clear: 'Очистить',
            done: 'Ок',
            months: [
              'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
              'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
            ],
            monthsShort: [
              'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
              'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
            ],
            weekdays: [
              'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
              'Четверг', 'Пятница', 'Суббота'
            ],
            weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            weekdaysAbbrev: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С']
          }
        }
        
        const datepickerInstance = M.Datepicker.init(this.datepicker.nativeElement, datepickerOptions);
        
        this.datepicker.nativeElement.addEventListener('change', () => {
          const selectedDate = datepickerInstance.date;
          if (selectedDate) {
            const formattedDate = this.formatDate(selectedDate);
            this.newTaskForm.get('deadline')?.setValue(formattedDate);
          }
        });
      }

      if (M && M.Timepicker && this.timepicker) {
        const timepickerOptions = {
          twelveHour: false,
          showClearBtn: true,
          autoClose: true,
          i18n: null as any
        };

        if (this.translateService.currentLang === 'ru') {
          timepickerOptions.i18n = {
            cancel: 'Отмена',
            clear: 'Очистить',
            done: 'Ок'
          }
        } else {
          timepickerOptions.i18n = {
            cancel: 'Cancel',
            clear: 'Clear',
            done: 'Done'
          }
        }
        
        const timepickerInstance = M.Timepicker.init(this.timepicker.nativeElement, timepickerOptions);
        
        this.timepicker.nativeElement.addEventListener('change', () => {
          const selectedTime = this.timepicker.nativeElement.value;
          if (selectedTime) {
            this.newTaskForm.get('deadlineTime')?.setValue(selectedTime);
          }
        });
      }
    }, 300);
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  addTask() {
    if (this.newTaskForm.valid) {
      const formValue = { ...this.newTaskForm.value };
      
      const taskData: Omit<Task, 'id' | 'createdAt'> = {
        title: formValue.title || '',
        description: formValue.description || '',
        status: (formValue.status as 'completed' | 'in-progress' | 'pending') || 'pending',
        priority: (formValue.priority as 'low' | 'medium' | 'high' | 'critical') || 'low',
        pinned: formValue.pinned || false,
        deadline: new Date(`${formValue.deadline}T${formValue.deadlineTime}:00`)
      };
      
      this.taskService.addTask(taskData).subscribe((task) => {
        console.log(task);
        this.resetForm();
        this.toastService.showToast('TASK_CREATED');
      });
    } else {
      console.log('Form is not valid');
    }
  }

  private resetForm() {
    this.newTaskForm.reset({
      title: '',
      description: '',
      status: 'pending',
      deadline: '',
      deadlineTime: '',
      priority: 'low',
      pinned: false
    });
  }
}
