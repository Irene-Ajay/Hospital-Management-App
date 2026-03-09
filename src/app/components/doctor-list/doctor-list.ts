import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DoctorService } from '../../services/doctor';
import { Doctor } from '../../models/doctor.model';
import { FilterDoctorPipe } from '../../pipes/filter-doctor-pipe';
import { HighlightDirective } from '../../directives/highlight';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatSelectModule, MatFormFieldModule, MatIconModule, MatChipsModule,
    FilterDoctorPipe, HighlightDirective
  ],
  templateUrl: './doctor-list.html',
  styleUrls: ['./doctor-list.css']
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedSpec = 'All';
  specializations = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

  constructor(private doctorService: DoctorService, private router: Router) {}

  ngOnInit(): void {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        console.log('Doctors loaded:', data);
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });
  }

  bookAppointment(doctor: Doctor): void {
    this.router.navigate(['/appointments', doctor.id]);
  }

  getStars(rating: number): string {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  }
}