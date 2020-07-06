import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private router: Router) {
  }

  onSearch(searchTerm): void {
    let navigateTo = '';

    if (parseInt(searchTerm, 10)) {
      navigateTo = '/block';
    } else if (searchTerm.length === 42) {
      navigateTo = '/address';
    } else if (searchTerm.length > 42) {
      navigateTo = '/transaction';
    }

    if (navigateTo.length > 0) {
      this.router.navigate([navigateTo, searchTerm]);
    }
  }
}
