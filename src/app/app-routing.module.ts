import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RecentActivityGithubComponent } from './recent-activity-github/recent-activity-github.component';
import { RecentActivityTwitterComponent } from './recent-activity-twitter/recent-activity-twitter.component';
import { RecentActivityComponent } from './recent-activity/recent-activity.component';
import { ResumeComponent } from './resume/resume.component';
import { TimelineComponent } from './timeline/timeline.component';

const routes: Routes = [
  {
    title: 'Contact me', path: "contact", component: ContactComponent
  },
  {
    title: 'My history', path: "timeline", component: TimelineComponent
  },
  {
    title: 'My recent activity', path: "activity", component: RecentActivityComponent
  },
  {
    title: 'My recent GitHub activity', path: "activity/github", component: RecentActivityGithubComponent
  },
  {
    title: 'My recent Twitter activity', path: "activity/twitter", component: RecentActivityTwitterComponent
  },
  {
    title: 'Welcome!', path: "home", component: HomeComponent
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    title: 'My Resume ...', path: "resume" ,component: ResumeComponent
  },
  {
    title: 'Oops!', path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
