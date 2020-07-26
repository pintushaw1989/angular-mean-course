import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { Post } from './../post.model';
import { PostsService } from './../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  // posts = [
  //   { title: 'First Post', content: 'This is first post content' },
  //   { title: 'Second Post', content: 'This is secont post content' },
  //   { title: 'Third Post', content: 'This is third post content' },
  // ];

  posts: Post[] = [];
  isLoading = false;

  // MatPaginator Inputs
  length = 0;
  pageSize = 2;
  pageSizeOptions: number[] = [1, 2, 3, 4, 5, 10];
  currentPage = 1;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.length = postData.postCount;
      });
  }

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    // console.log(pageData);
    this.postsService.getPosts(pageData.pageSize, pageData.pageIndex + 1);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }
}
