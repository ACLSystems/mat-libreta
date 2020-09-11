import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DataTablesModule } from 'angular-datatables';
import { ExportAsModule, ExportAsService } from 'ngx-export-as';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { CertService } from '../cert/cert.service';

import { RequestComponent } from './request/request.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestsRoutingModule } from './requests.routing.module';
import { RequestService } from './services/requests.service';
import { SpinnerComponent } from './spinner/spinner.component';
import { GroupComponent } from './group/group.component';


FullCalendarModule.registerPlugins([
	dayGridPlugin,
	timeGridPlugin,
	listPlugin
]);

@NgModule({
  declarations: [RequestComponent, RequestsComponent, SpinnerComponent, GroupComponent],
  imports: [
    CommonModule,
		FullCalendarModule,
		RequestsRoutingModule,
		DataTablesModule,
		ExportAsModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatDatepickerModule,
		NgxMaterialTimepickerModule.setLocale('es-MX')
  ],
	providers: [
		RequestService,
		ExportAsService,
		CertService,
		DecimalPipe
	]
})
export class RequestsModule { }
