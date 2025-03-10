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
    'agencyName',
    'agencyUrl',
    'agencyTimezone',
    'agencyLang',
    'agencyPhone',
    'agencyFareUrl',
    'agencyEmail',
  ];

  columnNames: { [fieldName: string]: string } = {
    agencyName: 'Name',
    agencyUrl: 'URL',
    agencyTimezone: 'Timezone',
    agencyLang: 'Language',
    agencyPhone: 'Phone',
    agencyFareUrl: 'Fare URL',
    agencyEmail: 'Email',
  };

  dataSource: AgencyDetails[] = AGENCY_DATA;
}

/**
 * Interface for the agency details
 * @Reference: https://gtfs.org/documentation/schedule/reference/#agencytxt
 */
