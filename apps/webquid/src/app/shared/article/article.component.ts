import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'webquid-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

	@Input() article: any;
	@Output() closeArticle = new EventEmitter<boolean>();

	constructor() {
		console.log('Arrancando artículo');
		console.log(this.article);
	}

  ngOnInit(): void {

  }

	closeDialog() {
		this.closeArticle.emit(true);
	}

}
