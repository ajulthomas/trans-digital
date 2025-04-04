import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { GtfsBuilderComponent } from './gtfs-builder/gtfs-builder.component';
import { environment } from '../environments/environment';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, GtfsBuilderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'trans-digital';

  appVersion = environment.version;
  buildDate = environment.buildDate;
  buildEnv = environment.buildEnv;
}
