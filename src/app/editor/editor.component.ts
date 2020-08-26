import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Article, ArticlesService, mimeType } from 'src/app/core';
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

  imageFileName: string;
  imagePreview: string;

  isSubmitting = true;
  tag = '';
  tagList: string[] = [];

  creating = true;
  mode = 'Publish';
  private slug: string;

  title = 'Publish Article';

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      imageFile: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]}),
      body: new FormControl(null),
      tag: new FormControl(null)
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('slug')) {
        this.mode = 'Update';
        this.creating = false;
        this.slug = paramMap.get('slug');
        this.articleService.get(this.slug).subscribe(article => {
          console.log(article);
          this.editorForm.setValue({
            title: article.title,
            description: article.description,
            body: article.body,
            tag: null,
            imageFile: article.imageUrl || null
          });
          this.context = article.body;
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
      const form = {...this.editorForm.value, tagList: this.tagList};
      delete form.tag;
      form.body = this.context;
      form.imageFile = this.editorForm.get('imageFile').value;

      this.articleService.save(form, this.creating).subscribe(
        article => {
          console.log(article);
          // this.router.navigate(['/article', article.slug]);
          this.isSubmitting = false;
        },
        err => {
          this.errors = err;
          this.isSubmitting = false;
        }
      );
    } else {
      console.log('form not valid', this.editorForm);
      return;
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.isSubmitting = true;
    this.imageFileName = file.name;
    this.editorForm.patchValue({imageFile: file});

    this.editorForm.get('imageFile').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.isSubmitting = false;
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addTag() {
    if (typeof this.tag === 'undefined' || this.tag === null || this.tag.length === 0) {
      return;
    }

    this.tagList.push(this.tag);
    this.tag = '';
  }

  removeTag(i: number) {
    this.tagList.splice(i, 1);
  }
}
