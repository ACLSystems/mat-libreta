import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { MainComponent } from './main/main.component';

import { ConfigRoutingModule } from './config.routing';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
		ConfigRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatSelectModule
  ]
})
export class ConfigModule { }
