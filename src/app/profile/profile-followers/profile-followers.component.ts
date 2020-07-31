import { Component, OnInit, Input } from '@angular/core';
import { ProfileListConfig } from 'src/app/core/models/profile-list-config.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-profile-followers',
  templateUrl: './profile-followers.component.html',
  styleUrls: ['./profile-followers.component.scss']
})
export class ProfileFollowersComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  title: string;
  username;
  isLoading = true;

  listConfig: ProfileListConfig = {
    type: '',
    filters: {}
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.title = this.route.snapshot.url[0].path;
      this.username = this.router.url.split('/')[2];
      this.listConfig.filters.username = this.username;
      this.listConfig.filters.query = this.title;
      this.listConfig.type = this.title;
      this.isLoading = false;
    });
  }

}
