import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { ExcelUtilsService } from '../services/excel-utils.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { AgencyDetailsComponent } from '../agency-details/agency-details.component';
import { MessageService } from '../services/message.service';
import { GtfsService } from '../services/gtfs.service';

@Component({
  selector: 'app-gtfs-builder',
  imports: [
    MatButtonModule,
    MatStepperModule,
    MatCardModule,
    MatTabsModule,
    AgencyDetailsComponent,
  ],
  templateUrl: './gtfs-builder.component.html',
  styleUrl: './gtfs-builder.component.scss',
})
export class GtfsBuilderComponent {
  constructor(
    private excelUtilsService: ExcelUtilsService,
    private messageService: MessageService,
    private gtfsService: GtfsService
  ) {}

  performance: number = 0; // Time taken to process file

  onFileSelected(event: any) {
    const start = performance.now();
    // console.log(event.target.files);
    const files = event.target.files;
    for (const file of files) {
      const name: string = file.name;
      const format: string | undefined = name.split('.').pop();
      console.log(name, file.size);
      console.log(file.size);
      if (format === 'xlsx') {
        // console.log('Excel file');
        this.excelUtilsService.readFile(file);
      } else {
        // console.log('Not an Excel file');
        this.messageService.showMessage(
          '⚠️ Please select an Excel file',
          'error'
        );
      }
    }
    const end = performance.now();
    this.performance = parseFloat((end - start).toFixed(2));
    console.log(`Time taken to process file: ${this.performance}ms`);
  }

  downloadGTFS() {
    this.gtfsService.downloadGTFS();
  }
}
