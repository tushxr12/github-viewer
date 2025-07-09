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
  errorMessage: string = '';
  loadingRepos: boolean = false;
  hasLoadedRepos: boolean = false;

  constructor(private http: HttpClient) { }

  // onSubmit() {
  //   if (!this.username.trim()) {
  //     this.errorMessage = "Please enter a Github username to proceed"
  //     return;
  //   }


  //   console.log('Searching GitHub user:', this.username);

  //   this.loading = true;
  //   this.userData = null;
  //   this.userRepos = [];
  //   this.errorMessage = '';

  //   const profileUrl = `https://api.github.com/users/${this.username}`;


  //   this.http.get(profileUrl).subscribe({
  //     next: (user) => {
  //       this.userData = user;
  //       this.loading = false;

  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       this.userData = null;
  //       this.userRepos = [];
  //       this.hasLoadedRepos = false;
  //       if (err.status === 404) {
  //         this.errorMessage = 'No user exists with this username, try again with some valid username!'
  //       }
  //       else if (err.status === 400) {
  //         this.errorMessage = 'Github user not found'
  //       }
  //       else {
  //         this.errorMessage = 'Something went wrong, Please try again in sometime.'
  //       }
  //     }
  //   });

  onSubmit() {
    const trimmedUsername = this.username.trim();

    // Always reset everything before searching
    this.errorMessage = '';
    this.userData = null;
    this.userRepos = [];
    this.loading = false;
    this.loadingRepos = false;
    this.hasLoadedRepos = false;

    // Exit early if input is empty - after resetting everything
    if (!trimmedUsername) {
      this.errorMessage = 'Please enter a GitHub username to proceed.';
      return;
    }

    this.loading = true;

    // Fetch user info
    this.http.get(`https://api.github.com/users/${trimmedUsername}`).subscribe({
      next: (data: any) => {
        this.userData = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'No user exists with this username, try again with some valid username!';
        this.userData = null;
        this.userRepos = [];
        this.hasLoadedRepos = false;
        this.loading = false;
      }
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

  loadRepos() {
    if (!this.username)
      return;

    this.loadingRepos = true;
    const reposUrl = `https://api.github.com/users/${this.username}/repos`;

    this.http.get(reposUrl).subscribe({
      next: (repos) => {
        this.userRepos = repos as any[];
        this.loadingRepos = false;
        this.hasLoadedRepos = true;
      },
      error: () => {
        this.loadingRepos = false;
        this.errorMessage = 'Failed to load repositories';
      }
    });
  }
}