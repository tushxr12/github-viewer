import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [FormsModule, CommonModule, HttpClientModule, HeaderComponent]
})
export class AppComponent {
  username: string = '';
  userData: any = null;
  userRepos: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  loadingRepos: boolean = false;
  hasLoadedRepos: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(private http: HttpClient) { }

  onSubmit() {
    const trimmedUsername = this.username.trim();

    // Reset everything before searching
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