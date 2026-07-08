import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent), title: 'Dhruv Gaur — Senior Full Stack Developer' },
  { path: 'about', loadComponent: () => import('./pages/about.component').then(m => m.AboutComponent) },
  { path: 'skills', loadComponent: () => import('./pages/skills.component').then(m => m.SkillsComponent) },
  { path: 'experience', loadComponent: () => import('./pages/experience.component').then(m => m.ExperienceComponent) },
  { path: 'projects', loadComponent: () => import('./pages/projects.component').then(m => m.ProjectsComponent) },
  { path: 'projects/:id', loadComponent: () => import('./pages/project-detail.component').then(m => m.ProjectDetailComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact.component').then(m => m.ContactComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found.component').then(m => m.NotFoundComponent) }
];
