import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AgencyDetails } from '../types/gtfs.interface';
import { AGENCY_DATA } from '../services/gtfs.service';

@Component({
  selector: 'agency-details',
  imports: [MatCardModule, MatTableModule],
  templateUrl: './agency-details.component.html',
  styleUrl: './agency-details.component.scss',
})
export class AgencyDetailsComponent {
  displayedColumns: string[] = [
    'agency_name',
    'agency_url',
    'agency_timezone',
    'agency_lang',
    'agency_phone',
    'agency_fare_url',
    'agency_email',
  ];

  columnNames: { [fieldName: string]: string } = {
    agency_name: 'Name',
    agency_url: 'URL',
    agency_timezone: 'Timezone',
    agency_lang: 'Language',
    agency_phone: 'Phone',
    agency_fare_url: 'Fare URL',
    agency_email: 'Email',
  };

  dataSource: AgencyDetails[] = AGENCY_DATA;
}

/**
 * Interface for the agency details
 * @Reference: https://gtfs.org/documentation/schedule/reference/#agencytxt
 */
