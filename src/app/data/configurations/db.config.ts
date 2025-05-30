import { NgModule } from '@angular/core';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
    name: 'TaskTrackerDB',
    version: 1,
    objectStoresMeta: [{
        store: 'tasks',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
            { name: 'title', keypath: 'title', options: { unique: false } },
            { name: 'description', keypath: 'description', options: { unique: false } },
            { name: 'completed', keypath: 'completed', options: { unique: false } },
            { name: 'status', keypath: 'status', options: { unique: false } },
            { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
            { name: 'deadline', keypath: 'deadline', options: { unique: false } },
            { name: 'pinned', keypath: 'pinned', options: { unique: false } },
            { name: 'priority', keypath: 'priority', options: { unique: false } }
        ]
    }]
};

@NgModule({
    imports: [
        NgxIndexedDBModule.forRoot(dbConfig)
    ]
}) export class AppModule { }