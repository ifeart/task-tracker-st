import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { NewTaskPageComponent } from './new-task-page.component';
import { TaskDbService } from '../../data/services/task-db.service';
import { ToastService } from '../../data/services/toast.service';

describe('NewTaskPageComponent', () => {
  let component: NewTaskPageComponent;
  let fixture: ComponentFixture<NewTaskPageComponent>;
  let mockTaskService: jasmine.SpyObj<TaskDbService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskDbService', ['addTask']);
    mockToastService = jasmine.createSpyObj('ToastService', ['showToast']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['get'], {
      currentLang: 'en'
    });

    mockTaskService.addTask.and.returnValue(of({ 
      id: 1, 
      title: 'Test Task', 
      description: 'Test Description',
      status: 'pending' as const,
      priority: 'medium' as const,
      pinned: false,
      deadline: new Date(),
      createdAt: new Date()
    }));

    mockTranslateService.get.and.returnValue(of('Translated Text'));

    await TestBed.configureTestingModule({
      imports: [
        NewTaskPageComponent,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: TaskDbService, useValue: mockTaskService },
        { provide: ToastService, useValue: mockToastService },
        { provide: TranslateService, useValue: mockTranslateService }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTaskPageComponent);
    component = fixture.componentInstance;
  });

  describe('старт', () => {
    it('должен создаться', () => {
      expect(component).toBeTruthy();
    });

    it('форма по умолчанию', () => {
      expect(component.newTaskForm.get('title')?.value).toBe('');
      expect(component.newTaskForm.get('description')?.value).toBe('');
      expect(component.newTaskForm.get('status')?.value).toBe('pending');
      expect(component.newTaskForm.get('priority')?.value).toBe('low');
      expect(component.newTaskForm.get('pinned')?.value).toBe(false);
      expect(component.newTaskForm.get('deadline')?.value).toBe('');
      expect(component.newTaskForm.get('deadlineTime')?.value).toBe('');
    });
  });

  describe('валидация', () => {
    it('обязательные поля', () => {
      const form = component.newTaskForm;
      
      expect(form.get('title')?.hasError('required')).toBe(true);
      expect(form.get('deadline')?.hasError('required')).toBe(true);
      expect(form.get('deadlineTime')?.hasError('required')).toBe(true);
      expect(form.valid).toBe(false);
    });

    it('мин длина заголовка', () => {
      const titleControl = component.newTaskForm.get('title');
      
      titleControl?.setValue('ab');
      expect(titleControl?.hasError('minlength')).toBe(true);
      
      titleControl?.setValue('abc');
      expect(titleControl?.hasError('minlength')).toBe(false);
    });

    it('макс длина заголовка', () => {
      const titleControl = component.newTaskForm.get('title');
      const longTitle = 'a'.repeat(101);
      
      titleControl?.setValue(longTitle);
      expect(titleControl?.hasError('maxlength')).toBe(true);
      
      titleControl?.setValue('a'.repeat(100));
      expect(titleControl?.hasError('maxlength')).toBe(false);
    });

    it('макс длина описания', () => {
      const descriptionControl = component.newTaskForm.get('description');
      const longDescription = 'a'.repeat(501);
      
      descriptionControl?.setValue(longDescription);
      expect(descriptionControl?.hasError('maxlength')).toBe(true);
      
      descriptionControl?.setValue('a'.repeat(500));
      expect(descriptionControl?.hasError('maxlength')).toBe(false);
    });

    it('валидация статуса', () => {
      const statusControl = component.newTaskForm.get('status');
      
      statusControl?.setValue('invalid-status');
      expect(statusControl?.hasError('pattern')).toBe(true);
      
      statusControl?.setValue('pending');
      expect(statusControl?.hasError('pattern')).toBe(false);
      
      statusControl?.setValue('in-progress');
      expect(statusControl?.hasError('pattern')).toBe(false);
      
      statusControl?.setValue('completed');
      expect(statusControl?.hasError('pattern')).toBe(false);
    });

    it('валидация приоритета', () => {
      const priorityControl = component.newTaskForm.get('priority');
      
      priorityControl?.setValue('invalid-priority');
      expect(priorityControl?.hasError('pattern')).toBe(true);
      
      priorityControl?.setValue('low');
      expect(priorityControl?.hasError('pattern')).toBe(false);
      
      priorityControl?.setValue('medium');
      expect(priorityControl?.hasError('pattern')).toBe(false);
      
      priorityControl?.setValue('high');
      expect(priorityControl?.hasError('pattern')).toBe(false);
      
      priorityControl?.setValue('critical');
      expect(priorityControl?.hasError('pattern')).toBe(false);
    });

    it('валидация даты', () => {
      const deadlineControl = component.newTaskForm.get('deadline');
      
      deadlineControl?.setValue('2024-1-1');
      expect(deadlineControl?.hasError('minlength')).toBe(true);
      
      deadlineControl?.setValue('2024-01-01');
      expect(deadlineControl?.hasError('minlength')).toBe(false);
      expect(deadlineControl?.hasError('maxlength')).toBe(false);
    });

    it('валидация времени', () => {
      const timeControl = component.newTaskForm.get('deadlineTime');
      
      timeControl?.setValue('9:30');
      expect(timeControl?.hasError('minlength')).toBe(true);
      
      timeControl?.setValue('09:30');
      expect(timeControl?.hasError('minlength')).toBe(false);
      expect(timeControl?.hasError('maxlength')).toBe(false);
    });
  });

  describe('добавление задачи', () => {
    beforeEach(() => {
      component.newTaskForm.patchValue({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        pinned: true,
        deadline: '2024-12-31',
        deadlineTime: '15:30'
      });
    });

    it('вызов сервиса с валид данными', () => {
      component.addTask();
      
      expect(mockTaskService.addTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        pinned: true,
        deadline: new Date('2024-12-31T15:30:00')
      });
    });

    it(' уведомление после успешного добавления', () => {
      component.addTask();
      
      expect(mockToastService.showToast).toHaveBeenCalledWith('TASK_CREATED');
    });

    it('сброс формы', () => {
      component.addTask();
      
      expect(component.newTaskForm.get('title')?.value).toBe('');
      expect(component.newTaskForm.get('description')?.value).toBe('');
      expect(component.newTaskForm.get('status')?.value).toBe('pending');
      expect(component.newTaskForm.get('priority')?.value).toBe('low');
      expect(component.newTaskForm.get('pinned')?.value).toBe(false);
      expect(component.newTaskForm.get('deadline')?.value).toBe('');
      expect(component.newTaskForm.get('deadlineTime')?.value).toBe('');
    });

    it('не добавлять задачу при невалидной форме', () => {
      component.newTaskForm.get('title')?.setValue('');
      
      component.addTask();
      
      expect(mockTaskService.addTask).not.toHaveBeenCalled();
      expect(mockToastService.showToast).not.toHaveBeenCalled();
    });

    it('обработка пустых необязательных полей', () => {
      component.newTaskForm.patchValue({
        description: '',
        pinned: false
      });
      
      component.addTask();
      
      expect(mockTaskService.addTask).toHaveBeenCalledWith(jasmine.objectContaining({
        description: '',
        pinned: false
      }));
    });

    it('форма после сброса', () => {
      component.addTask();
      
      expect(component.newTaskForm.get('status')?.value).toBe('pending');
      expect(component.newTaskForm.get('priority')?.value).toBe('low');
      expect(component.newTaskForm.get('pinned')?.value).toBe(false);
      
      component.newTaskForm.patchValue({
        title: 'Second Task',
        description: 'Second Description',
        status: 'in-progress',
        priority: 'high',
        pinned: true,
        deadline: '2025-01-15',
        deadlineTime: '10:00'
      });
      
      expect(component.newTaskForm.valid).toBe(true);
      
      component.addTask();
      
      expect(mockTaskService.addTask).toHaveBeenCalledWith({
        title: 'Second Task',
        description: 'Second Description',
        status: 'in-progress',
        priority: 'high',
        pinned: true,
        deadline: new Date('2025-01-15T10:00:00')
      });
    });
  });

  describe('форматирование даты', () => {
    it('форматирование даты', () => {
      const testDate = new Date(2024, 0, 15);
      const formattedDate = component['formatDate'](testDate);
      
      expect(formattedDate).toBe('2024-01-15');
    });

    it('нули для месяца и дня', () => {
      const testDate = new Date(2024, 4, 5);
      const formattedDate = component['formatDate'](testDate);
      
      expect(formattedDate).toBe('2024-05-05');
    });
  });
});
