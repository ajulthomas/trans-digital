import { Routes } from '@angular/router';
import { GtfsBuilderComponent } from './gtfs-builder/gtfs-builder.component';

export const routes: Routes = [
  { path: '', redirectTo: '/gtfs-builder', pathMatch: 'full' },
  { path: 'gtfs-builder', component: GtfsBuilderComponent },
];
