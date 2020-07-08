import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

import { CommonService } from '@mat-libreta/shared';
import { OperService } from '../services/oper.services';

@Component({
  selector: 'mat-libreta-massive',
  templateUrl: './massive.component.html',
  styleUrls: ['./massive.component.scss']
})
export class MassiveComponent implements OnInit {

	loading: boolean = false;
	excelData: any[] = [];
	progress: string = '0';
	progressStyle: string = 'width: 0%;';
	progressColor: string = 'bg-success';
	errors: any[] = [];
	success: any[] = [];
  constructor(
		private router: Router,
		private operService: OperService,
		private commonService: CommonService,
	) {
		this.reset();
	}

  ngOnInit(): void {
  }

	goToHome() {
		this.router.navigate(['/services'])
	}

	goOper() {
		this.router.navigate(['/oper']);
	}

	onFileChange(event:any) {
		this.commonService.displayLog('File Event trigger','Success');
		const target: DataTransfer = <DataTransfer>(event.target);
		if(target.files.length !== 1) {
			Swal.fire({
				type: 'error',
				text: 'Solo puede procesarse un archivo a la vez'
			});
			return;
		}
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			console.log('Estoy aquí!')
			/* Leer el archivo */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			/* Traemos la primera hoja (sheet) */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			/* Listo... tenemos los datos */
			this.excelData = convertToArray(XLSX.utils.sheet_to_json(ws,{header:1}));
			this.commonService.displayLog('Excel',this.excelData);
		};
		reader.readAsBinaryString(target.files[0]);
	}

	runLoading(index:number) {
		if(this.excelData[index]) {
			let itr = this.excelData[index];
			let len = this.excelData.length;
			this.operService
				.addUserEmail(itr.identifier,itr.email)
				.subscribe(data => {
					this.progress = index + 1 + '';
					let width = Math.floor((index+1)*100/len);
					this.progressStyle = `width: ${width}%;`;
					if(data && data.message && data.message.includes('')) {
					}
					this.success.push({
						identifier: itr.identifier,
						email: itr.email
					});
					this.runLoading(index +1);
				}, error => {
					this.progress = index +'';
					let width = Math.floor(index*100/len);
					this.progressStyle = `width: ${width}%;`;
					this.errors.push({
						identifier: itr.identifier,
						email: itr.email,
						error: error.replace(/<p>/g,'').replace(/<\/p>/g,'')
					});
					this.runLoading(index +1);
				});
		} else {
			this.commonService.displayLog('Success',this.success);
			this.commonService.displayLog('Errors',this.errors);
		}
	}

	reset() {
		this.excelData= [];
		this.progress = '0';
		this.progressStyle = 'width: 0%;';
		this.progressColor = 'bg-primary';
		this.errors = [];
		this.success = [];
		$('#file').val('');
	}

}

function convertToArray(arr:any) {
	const len = arr.length;
	console.log(arr);
	var returnedArray = [];
	for(let i=1;i<len;i++) {
		if(arr[i].length > 0) {
			returnedArray.push({
				[arr[0][0]]: arr[i][0].toUpperCase(),
				[arr[0][1]]: arr[i][1].toLowerCase()
			})
		}
	}
	return returnedArray;
}
