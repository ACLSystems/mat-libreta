import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { MainComponent } from './main/main.component';

import { ConfigRoutingModule } from './config.routing';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
		ConfigRoutingModule,
		ReactiveFormsModule,
		MatInputModule
  ]
})
export class ConfigModule { }
