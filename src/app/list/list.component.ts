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
  @Input() commands:string[] =[];
  @Input() lastData:string[] =[];
  mainPos = {x: -350, y: 100};
  comPos = {x: 300, y: -210};
  constructor() { }

  ngOnInit(): void {
  }

  getCurrentLevelName(){
    switch(this.level){
      case 0:
        return "Easy";
      case 1:
        return "Normal";
      case 2:
        return "Hard";
      case 3:
        return "Extreme";
      case 4:
        return "Crazy";
    }
    return "No Level selected"
  }

}
