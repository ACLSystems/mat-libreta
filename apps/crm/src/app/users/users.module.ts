import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { UserRoutingModule } from './users.routing.module';
import { CreateUserComponent } from './create/create.component';


@NgModule({
  declarations: [CreateUserComponent],
  imports: [
    CommonModule,
		UserRoutingModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule
  ]
})
export class UsersModule { }
