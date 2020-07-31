import { TagsService } from './../core/services/tags.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private tagsService: TagsService) { }
  isLoading = false;
  trends: string[];

  ngOnInit(): void {
    this.tagsService.getAll().subscribe(tags => {
      this.trends = tags;
    });
  }

}
