import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ArticlesService } from './../core/services/articles.service';
import { Article } from 'src/app/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Errors } from '../core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  constructor(
    private articleService: ArticlesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  context = `<p>Start your stroy</p>`;
  article: Article;
  editorForm: FormGroup;
  errors: Errors = { error: {} };
  isSubmitting = true;
  tagList: string[] = [];

  creating = true;
  mode = 'Publish';
  private slug: string;

  title = 'Publish Article';

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      body: new FormControl(null, { validators: [Validators.required] }),
      tag: new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('slug')) {
        this.mode = 'Update';
        this.creating = false;
        this.slug = paramMap.get('slug');
        this.articleService.get(this.slug).subscribe(article => {
          this.article = article;
          this.editorForm.setValue({
            title: article.title,
            description: article.description,
            body: article.body,
            tag: null
          });
          this.tagList = article.tagList;
          this.isSubmitting = false;
        });
      } else {
        this.mode = '';
        this.creating = true;
        this.isSubmitting = false;
        this.slug = '';
      }
    });
  }

  submitArticle() {
    this.isSubmitting = true;
    this.errors = { error: {} };
    if (this.editorForm.valid) {
      const form = { ...this.editorForm.value };
      delete form.tag;
      form.tagList = this.tagList;

      this.articleService.save(form, this.creating).subscribe(
        article => {
          this.router.navigate(['/article', article.slug]);
          this.isSubmitting = false;
        },
        err => {
          this.errors = err;
          this.isSubmitting = false;
        }
      );
    } else {
      return;
    }
  }

  addTag() {
    const tag = this.editorForm.get('tag').value;
    if (!tag || tag.length === 0 || tag === null) {
      return;
    }
    this.tagList.push(tag);
    this.editorForm.get('tag').reset();
  }

  removeTag(i: number) {
    this.tagList.splice(i, 1);
  }
}
