import { Routes } from '@angular/router';
import { GtfsBuilderComponent } from './gtfs-builder/gtfs-builder.component';
import { RouteMapComponent } from './route-map/route-map.component';

export const routes: Routes = [
  { path: '', redirectTo: '/gtfs-builder', pathMatch: 'full' },
  { path: 'gtfs-builder', component: GtfsBuilderComponent },
  { path: 'route-map', component: RouteMapComponent },
  { path: '**', redirectTo: '/gtfs-builder' },
];
