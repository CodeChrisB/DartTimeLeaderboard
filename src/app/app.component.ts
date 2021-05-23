import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Paho } from 'ng2-mqtt/mqttws31';

interface  LeadData{
  name:string;
  score:number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Leaderboard';
  level=0;
  data: string = '';
  topic:string = '';
  model:any;
  client :any;
  base = 'x6et/q8zl/'
  leaderboard ='x6et/q8zl/game/leaderboard'
  mqttbroker = 'broker.mqttdashboard.com';

  ngOnInit(){
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(8000), 'wxview');
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({onSuccess: this.onConnect.bind(this)});
  }

  onConnect() {
    console.log('onConnect');
    this.client.subscribe(this.leaderboard+'/#');
  }

  onConnectionLost(responseObject:any) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  onMessageArrived(message:any) {
    console.log('onMessageArrived: ' + message.destinationName + ': ' + message.payloadString);
    this.data =message.payloadString

    this.topic=  message.destinationName


    this.model = <LeadData[]> JSON.parse(this.data)
    this.model =this.model.data;
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);

    let packet = new Paho.MQTT.Message("Reload Leaderboard");
    console.log(this.base+"get/Leaderboard/"+tabChangeEvent.index)
    //x6et/q8zl/get/Leaderboard/#
    //x6et/q8zl/get/Leaderboard/2
    packet.destinationName = this.base+"get/leaderboard/"+tabChangeEvent.index;
    this.client.send(packet);
}



}

