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

  constructor(private http: HttpClient){}

  onSubmit() {
    console.log('Searching GitHub user:', this.username);

    const profileUrl = `https://api.github.com/users/${this.username}`;
    const reporsUrl = `https://api.github.com/users/${this.username}/repos`;

    this.http.get(profileUrl).subscribe({
      next: (data)=>{
        this.userData = data;
        console.log("Github user data : ", this.userData);
      },

      error: (err)=>{
        console.log("User not found : ", err);
        this.userData = null;
        
      }
    })

    this.http.get(reporsUrl).subscribe({
      next: (repos: any) => {
          this.userRepos = repos;
      },

      error: (err)=>{
        console.log("Repos not found: ", err);
        this.userRepos = [];
        
      }
    })
  }
}
