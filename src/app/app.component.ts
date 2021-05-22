import { Component, OnInit } from '@angular/core';
import { Paho } from 'ng2-mqtt/mqttws31';

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
  client :any;
  base = 'x6et/q8zl/'
  mqttbroker = 'broker.mqttdashboard.com';

  ngOnInit(){
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(8000), 'wxview');
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({onSuccess: this.onConnect.bind(this)});
  }

  onConnect() {
    console.log('onConnect');
    this.client.subscribe('x6et/q8zl/#');
  }

  onConnectionLost(responseObject:any) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  onMessageArrived(message:any) {
    console.log('onMessageArrived: ' + message.destinationName + ': ' + message.payloadString);
    this.data = message.payloadString;


   this.topic=  message.destinationName
  }
}

