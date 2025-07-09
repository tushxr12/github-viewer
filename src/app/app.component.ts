import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class AppComponent {
  username: string = '';
  userData: any = null;
  userRepos: any[] = [];
  loading: boolean = false;

  constructor(private http: HttpClient){}

  onSubmit() {
    if(!this.username.trim())
      return;

    console.log('Searching GitHub user:', this.username);

    this.loading = true;
    this.userData = null;
    this.userRepos = [];

    const profileUrl = `https://api.github.com/users/${this.username}`;
    const reposUrl = `https://api.github.com/users/${this.username}/repos`;

    this.http.get(profileUrl).subscribe({
      next: (user) => {
        this.userData = user;
        this.http.get(reposUrl).subscribe({
          next: (repos) => {
            this.userRepos = repos as any[];
            this.loading = false;
          },
          error: () => this.loading = false,
        });
      },
      error: () => this.loading = false,
    });

    // this.http.get(profileUrl).subscribe({
    //   next: (data)=>{
    //     this.userData = data;
    //     console.log("Github user data : ", this.userData);
    //   },

    //   error: (err)=>{
    //     console.log("User not found : ", err);
    //     this.userData = null;
        
    //   }
    // })

    // this.http.get(reporsUrl).subscribe({
    //   next: (repos: any) => {
    //       this.userRepos = repos;
    //   },

    //   error: (err)=>{
    //     console.log("Repos not found: ", err);
    //     this.userRepos = [];
        
    //   }
    // })
  }
}
