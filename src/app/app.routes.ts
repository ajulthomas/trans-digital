import { Routes } from '@angular/router';
import { GtfsBuilderComponent } from './gtfs-builder/gtfs-builder.component';
import { RouteMapComponent } from './route-map/route-map.component';

export const routes: Routes = [
  { path: '', component: GtfsBuilderComponent },
  { path: 'gtfs-builder', redirectTo: '', pathMatch: 'full' },
  { path: 'route-map', component: RouteMapComponent },
  { path: '**', redirectTo: '/gtfs-builder' },
];
