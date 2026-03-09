import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DoctorService } from '../../services/doctor';
import { Doctor } from '../../models/doctor.model';
import { HighlightDirective } from '../../directives/highlight';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    HighlightDirective
  ],
  templateUrl: './doctor-list.html',
  styleUrls: ['./doctor-list.css']
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedSpec = 'All';
  searchTerm = '';
  sortBy: 'rating' | 'fee-low' | 'fee-high' | 'experience' = 'rating';
  specializations = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const spec = params.get('spec');
      if (spec && this.specializations.includes(spec)) {
        this.selectedSpec = spec;
      }
    });

    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
      }
    });
  }

  bookAppointment(doctor: Doctor): void {
    this.router.navigate(['/appointments', doctor.id]);
  }

  clearFilters(): void {
    this.selectedSpec = 'All';
    this.searchTerm = '';
    this.sortBy = 'rating';
  }

  get filteredDoctors(): Doctor[] {
    const term = this.searchTerm.trim().toLowerCase();
    const filtered = this.doctors.filter((doctor) => {
      const matchesSpec = this.selectedSpec === 'All' || doctor.specialization === this.selectedSpec;
      const matchesText =
        !term ||
        doctor.name.toLowerCase().includes(term) ||
        doctor.specialization.toLowerCase().includes(term);
      return matchesSpec && matchesText;
    });

    return filtered.sort((a, b) => {
      if (this.sortBy === 'fee-low') return a.fee - b.fee;
      if (this.sortBy === 'fee-high') return b.fee - a.fee;
      if (this.sortBy === 'experience') return b.experience - a.experience;
      return b.rating - a.rating;
    });
  }

  getStars(rating: number): string {
    return '\u2605'.repeat(Math.floor(rating)) + '\u2606'.repeat(5 - Math.floor(rating));
  }
}
