import { ProfileListConfig } from 'src/app/core/models/profile-list-config.model';

import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ArticleListConfig, ProfilesService } from 'src/app/core';
import { Profile } from 'selenium-webdriver/firefox';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent {
  constructor(private profileService: ProfilesService) {}

  querySub: Subscription;

  @Input() limit: number;
  @Input() set listConfig(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.searchQuery();
    }
  }

  query: ProfileListConfig;
  profiles: Profile[] = [];
  isLoading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];

  searchQuery() {
    this.isLoading = true;

    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset = this.limit * (this.currentPage - 1);
    }

    this.profileService.query(this.query).subscribe(
      data => {
        this.profiles = data.profiles;
        this.isLoading = false;
      },
      err => {
        console.log('Error');
      }
    );
  }
}
