import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material';

import { NavbarComponent } from './navbar.component';

@NgModule({
		imports: [ RouterModule, CommonModule, MatButtonModule ],
		declarations: [ NavbarComponent],
		exports: [ NavbarComponent ]
})

export class NavbarModule {}
