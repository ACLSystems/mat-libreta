import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { UsersRoutingModule } from './users.routing.module';
import { UsersComponent } from './users/users.component';

import { RequestService } from '../requests/services/requests.service';

@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
		UsersRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule
  ],
	providers: [
		RequestService
	]
})
export class UsersModule { }
