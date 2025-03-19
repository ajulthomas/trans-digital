import { Component } from '@angular/core';
import { CalendarDetails } from '../types/gtfs.interface';
import { CALENDAR_DATA } from '../services/gtfs.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'calendar-details',
  imports: [MatCardModule, MatTableModule],
  templateUrl: './calendar-details.component.html',
  styleUrl: './calendar-details.component.scss',
})
export class CalendarDetailsComponent {
  displayedColumns: string[] = [
    'service_id',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'start_date',
    'end_date',
  ];

  columnNames: { [fieldName: string]: string } = {
    service_id: 'Service ID',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
    start_date: 'Start Date',
    end_date: 'End Date',
  };

  dataSource: CalendarDetails[] = CALENDAR_DATA;
}
