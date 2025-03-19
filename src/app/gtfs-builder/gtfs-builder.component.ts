import { Component, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { ExcelUtilsService } from '../services/excel-utils.service';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { AgencyDetailsComponent } from '../agency-details/agency-details.component';
import { MessageService } from '../services/message.service';
import { GtfsService } from '../services/gtfs.service';
import { CalendarDetailsComponent } from '../calendar-details/calendar-details.component';

@Component({
  selector: 'app-gtfs-builder',
  imports: [
    MatButtonModule,
    MatStepperModule,
    MatCardModule,
    MatTabsModule,
    AgencyDetailsComponent,
    CalendarDetailsComponent,
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

  // performance as signal
  performance: WritableSignal<number> = signal<number>(0);

  onFileSelected(event: any) {
    // console.log(event.target.files);
    const files = event.target.files;
    for (const file of files) {
      const name: string = file.name;
      const format: string | undefined = name.split('.').pop();
      console.log(name, file.size);
      console.log(file.size);
      if (format === 'xlsx') {
        // console.log('Excel file');
        this.readFile(file, this.performance);
      } else {
        // console.log('Not an Excel file');
        this.messageService.showMessage(
          '⚠️ Please select an Excel file',
          'error'
        );
      }
    }
    console.log(`Time taken to process file: ${this.performance}ms`);
  }

  downloadGTFS() {
    this.gtfsService.downloadGTFS();
  }

  readFile(file: File, time: WritableSignal<number> = signal<number>(0)) {
    const reader = new FileReader();
    reader.onload = () => {
      // progress.set(100);
      this.messageService.showMessage('File read successfully 🚀');
      const data: ArrayBuffer = new Uint8Array(reader.result as ArrayBuffer);
      const start = performance.now();
      this.excelUtilsService.processFile(data);
      this.gtfsService.extractGTFSInfo();
      const end = performance.now();
      time.set(end - start);
    };
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        // progress.set(percent);
      }
    };
    reader.onerror = (error) => {
      console.error(error);
      this.messageService.showMessage(
        'Some error occured, please try again',
        'error'
      );
    };
    reader.readAsArrayBuffer(file);
  }
}
