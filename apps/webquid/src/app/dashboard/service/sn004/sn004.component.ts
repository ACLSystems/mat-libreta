import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { UserService } from '@wqshared/services/user.service';

@Component({
  selector: 'webquid-sn004',
  templateUrl: './sn004.component.html',
  styleUrls: ['./sn004.component.scss']
})
export class Sn004Component implements OnInit {

  constructor(
		private userService: UserService
	) { }

  ngOnInit(): void {
  }

	test() {
		Swal.fire('Espera...');
		Swal.showLoading();
		this.userService.test()
			.subscribe(data => {
				console.log(data);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'success',
					text: 'listo'
				});
			}, error => {
				var textMessage = '';
				if(error.message) {
					textMessage = error.message;
				}
				if(error.error && error.error.message) {
					textMessage = error.error.message;
				}
				if(textMessage.includes('Timeout')) {
					textMessage = '<p>El servicio no respondió en un tiempo razonable.</p> <p>Intenta de nuevo más tarde, o revisa si tienes conexión a Internet</p>'
				}
				console.log(error);
				Swal.hideLoading();
				Swal.close();
				Swal.fire({
					type: 'error',
					html: `<b>Error:</b> ${textMessage}`
				});
			})
	}


}
