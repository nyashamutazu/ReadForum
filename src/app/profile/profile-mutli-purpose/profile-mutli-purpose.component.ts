import { Profile } from './../../core/models/profile.model';
import { Component, OnInit, Input } from '@angular/core';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { ArticleListConfig } from 'src/app/core';

@Component({
  selector: 'app-profile-mutli-purpose',
  templateUrl: './profile-mutli-purpose.component.html',
  styleUrls: ['./profile-mutli-purpose.component.scss']
})
export class ProfileMutliPurposeComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  title: string;
  isLoading = true;

  username: string;
  listConfig: ArticleListConfig = {
    type: '',
    filters: {}
  };

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.title = this.route.snapshot.url[0].path;
      this.username = this.router.url.split('/')[2];
      this.listConfig.filters[`${this.title}`] = this.username;
      this.isLoading = false;
    });
  }
}
