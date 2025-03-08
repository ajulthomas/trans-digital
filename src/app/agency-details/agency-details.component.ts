import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

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
export interface AgencyDetails {
  agencyId: string;
  agencyName: string;
  agencyUrl: string;
  agencyTimezone: string;
  agencyLang?: string;
  agencyPhone?: string;
  agencyFareUrl?: string;
  agencyEmail?: string;
}

const AGENCY_DATA: AgencyDetails[] = [
  {
    agencyId: 'BST',
    agencyName: 'Batik Solo Trans',
    agencyUrl:
      'https://pariwisatasolo.surakarta.go.id/wp-content/uploads/2019/01/Transit-Map-Solo.pdf',
    agencyTimezone: 'Asia/Jakarta',
    agencyLang: 'en',
    agencyPhone: '',
    agencyFareUrl: 'https://pariwisatasolo.surakarta.go.id/',
    agencyEmail: '',
  },
];
