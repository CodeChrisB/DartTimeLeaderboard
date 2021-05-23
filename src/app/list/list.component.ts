import { Component, Input, OnInit } from '@angular/core';
interface  LeadData{
  name:string;
  score:number;
}

@Component({
  selector: 'leaderboard',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() level:any;
  @Input() model:LeadData[] =[];
  constructor() { }

  ngOnInit(): void {
  }

}
