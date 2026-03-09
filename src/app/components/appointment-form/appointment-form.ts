import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../services/doctor';
import { AppointmentService } from '../../services/appointment';
import { AuthService } from '../../services/auth';
import { Doctor } from '../../models/doctor.model';
import { Patient } from '../../models/patient.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule, MatSnackBarModule
  ],
  templateUrl: './appointment-form.html',
  styleUrls: ['./appointment-form.css']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  selectedDoctor: Doctor | null = null;
  timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
  minDate = new Date();
  isReceptionist = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.isReceptionist = user?.role === 'receptionist';

    this.appointmentForm = this.fb.group({
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      notes: ['']
    });

    if (this.isReceptionist) {
      this.appointmentForm.addControl('patientId', this.fb.control('', Validators.required));
      this.http.get<Patient[]>(`${environment.apiUrl}/patients`).subscribe(patients => {
        this.patients = patients.filter(p => (p as any).role !== 'receptionist'); // Exclude receptionists
      });
    }

    this.doctorService.getDoctors().subscribe((doctors) => {
      this.doctors = doctors;
      const id = this.route.snapshot.params['doctorId'];
      if (id) {
        this.appointmentForm.patchValue({ doctorId: id });
        this.onDoctorChange(id);
      }
    });

    this.appointmentForm.get('doctorId')?.valueChanges.subscribe(id => this.onDoctorChange(id));
  }

  onDoctorChange(id: string): void {
    this.selectedDoctor = this.doctors.find(d => d.id === id) || null;
  }

  submit(): void {
    if (this.appointmentForm.invalid) return;
    const user = this.authService.currentUser;
    if (!user || !this.selectedDoctor) return;

    const formValue = this.appointmentForm.value;
    const dateStr = new Date(formValue.date).toISOString().split('T')[0];

    const patientId = this.isReceptionist ? formValue.patientId : user.id;
    const selectedPatient = this.isReceptionist ? this.patients.find(p => p.id === patientId) : null;

    const appointment = {
      patientId: patientId,
      patientName: selectedPatient ? selectedPatient.name : user.name,
      doctorId: this.selectedDoctor.id,
      doctorName: this.selectedDoctor.name,
      specialization: this.selectedDoctor.specialization,
      date: dateStr,
      time: formValue.time,
      status: 'pending' as const,
      notes: formValue.notes || '',
      fee: this.selectedDoctor.fee
    };

    this.appointmentService.book(appointment).subscribe(() => {
      this.snackBar.open('Appointment booked successfully!', 'Close', { duration: 3000 });
      this.router.navigate([this.isReceptionist ? '/doctor-dashboard' : '/dashboard']);
    });
  }
}