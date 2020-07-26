import { Component, OnInit, Input } from '@angular/core';
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

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsService.getPostUpdateListener().subscribe((data: Post[]) => {
      this.isLoading = false;
      this.posts = data;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
}
