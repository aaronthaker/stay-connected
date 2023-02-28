import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public dashboard!: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.dashboard = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

}
