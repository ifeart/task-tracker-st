import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { NewTaskPageComponent } from './pages/new-task-page/new-task-page.component';
import { TaskSettingPageComponent } from './pages/task-setting-page/task-setting-page.component';
import { WeekTasksPageComponent } from './pages/week-tasks-page/week-tasks-page.component';
import { TodayPageComponent } from './pages/today-page/today-page.component';

export const routes: Routes = [
    { path: '', component: MainPageComponent },
    { path: 'new-task', component: NewTaskPageComponent },
    { path: 'task/:id', component: TaskSettingPageComponent },
    { path: 'week-tasks', component: WeekTasksPageComponent },
    { path: 'today', component: TodayPageComponent },
    { path: '**', redirectTo: '' }
];
