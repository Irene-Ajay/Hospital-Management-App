import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthUser } from '../models/user.model';
import { Patient } from '../models/patient.model';
import { Doctor } from '../models/doctor.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private patientsUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('currentUser');
    if (stored) this.currentUserSubject.next(JSON.parse(stored));
  }

  get currentUser(): AuthUser | null { return this.currentUserSubject.value; }
  get isLoggedIn(): boolean { return !!this.currentUserSubject.value; }

  login(email: string, password: string): Observable<AuthUser | null> {
    if (email && password) {
      const user: AuthUser = { id: '999', name: 'Receptionist', email: email, role: 'receptionist' };
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    }
    return of(null);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(patient: Omit<Patient, 'id'>): Observable<Patient> {
    return this.http.post<Patient>(this.patientsUrl, { ...patient, medicalHistory: [] });
  }
}