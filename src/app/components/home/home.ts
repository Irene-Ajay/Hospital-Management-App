import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  features = [
    { icon: 'calendar_today', title: 'Easy Booking', desc: 'Book appointments online in minutes' },
    { icon: 'people', title: 'Expert Doctors', desc: 'Access to top specialists across all fields' },
    { icon: 'history', title: 'Medical Records', desc: 'View and manage your health history' },
    { icon: 'notifications', title: 'Reminders', desc: 'Get notified about upcoming appointments' }
  ];
  specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];
  constructor(private router: Router) {}
  bookNow(): void { this.router.navigate(['/doctors']); }

  exploreSpecialization(spec: string): void {
    this.router.navigate(['/doctors'], { queryParams: { spec } });
  }
}
