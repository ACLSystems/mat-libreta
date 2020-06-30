import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Identity, Roles } from '@wqshared/types/user.type';
import { CommonService } from '@wqshared/services/common.service';
import { PublicService } from '@wqshared/services/public.service';

import { ArticleComponent } from '@wqshared/article/article.component';

@Component({
  selector: 'webquid-pages-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

	loading: boolean = false;
	identity: Identity = null;
	roles: Roles = null;
	publicUser: boolean = true;
	publicFolder: any = {};
	publicArticles: any[] = [];
	article: any = false;
	articleOpen: boolean = false;

	constructor(
		private commonService: CommonService,
		private publicService: PublicService,
		public matDialog: MatDialog
	) {
		this.identity = this.commonService.getidentity();
		if(this.identity) {
			this.roles = this.identity.roles;
			this.publicUser = false;
		} else {
			this.publicUser = true;
		}
	}

  ngOnInit(): void {
		this.publicService.publicHelp().subscribe((data:any) => {
			// console.group('publicHelp');
			// console.log(data);
			// console.groupEnd();
			if(data && data.visibility === 1) {
				this.publicFolder = Object.assign({},data);
				if(this.publicFolder.articles && Array.isArray(this.publicFolder.articles)) {
					this.publicArticles = this.publicFolder.articles.filter(article => article.status !== 0);
				}
			} else {
				this.publicFolder = {};
				this.publicArticles = [];
			}
		});
  }

	openArticle(index:number) {
		this.article = this.publicArticles[index];
		this.articleOpen = true;
		// console.group('Llamando artículo');
		// console.log(this.articleOpen);
		// console.log(this.article);
		// console.groupEnd()
	}

	closeArticle() {
		this.articleOpen = false;
		this.article = false;
	}

}
