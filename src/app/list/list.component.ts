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
  constructor() { }
  data: LeadData[] = [
    {name: "Superrobster",score:15750},
    {name: "Christina",score:15450},
    {name: "Nope",score:15250},
    {name: "Sk1ller",score:14900},
    {name: "Sk1ller",score:12500},
    {name: "Sk1ller",score:11900},
    {name: "Sk1ller",score:10455},
    {name: "Sk1ller",score:9940},
    {name: "Sk1ller",score:8880},
    {name: "Sk1ller",score:7455},
  ]
  ngOnInit(): void {
  }

}
