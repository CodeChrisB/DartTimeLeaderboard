import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Paho } from 'ng2-mqtt/mqttws31';

interface LeadData {
  name: string;
  score: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Leaderboard';
  level = 0;
  commandAmount:number =5;
  data: string = '';
  topic: string = '';
  model: any;
  client: any;
  base = 'x6et/q8zl/'
  leaderboard = 'x6et/q8zl/game/leaderboard'
  mqttbroker = 'broker.mqttdashboard.com';
  commands: string[] = [
    " _____            _                     _      ____        \n"+
    "|  __ \\          | |                   | |    / __ \\       \n"+
    "| |__) |   ___   | |__     ___   _ __  | |_  | |  | |  ___ \n"+
    "|  _  /   / _ \\  | '_ \\   / _ \\ | '__| | __| | |  | | / __|\n"+
    "| | \\ \\  | (_) | | |_) | |  __/ | |    | |_  | |__| | \\___\ \n"+
    "|_|  \\_\\  \\___/  |_.__/   \\___| |_|     \\__|  \\____/  |___/ \n",
    "This is the Mqtt Request Terminal here you will see the requests,",
    "that will be sent from this client or recevied from the Database"
  ];
  showText =true;
  ngOnInit() {
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(8000), 'wxview');
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({ onSuccess: this.onConnect.bind(this) });
  }

  onConnect() {
    //console.log('onConnect');
    this.client.subscribe(this.leaderboard + '/#');
    this.sendMessage(0);
  }

  onConnectionLost(responseObject: any) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  onMessageArrived(message: any) {
    //console.log('onMessageArrived: ' + message.destinationName + ': ' + message.payloadString);
    this.data = message.payloadString

    this.topic = message.destinationName


    this.model = <LeadData[]>JSON.parse(this.data)
    this.model = this.model.data;
    this.displayCommands("OnMessage: " + this.topic);
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    console.log('tabChangeEvent => ', tabChangeEvent);
    this.level = tabChangeEvent.index
    this.sendMessage(this.level);
    this.displayCommands("SendRequest: "+this.base+"get/leaderboard ----> data: "+tabChangeEvent.index);

    }

  sendMessage(level:number){
    let packet = new Paho.MQTT.Message(level+"");
    console.log(this.base + "get/Leaderboard")
    //x6et/q8zl/get/Leaderboard/#
    //x6et/q8zl/get/Leaderboard/2
    packet.destinationName = this.base + "get/leaderboard";
    this.client.send(packet);

  }

  displayCommands(command:string){
    this.commands.push(command)
    if(this.commands.length>this.commandAmount)
    this.commands = this.commands.slice(1,this.commandAmount+1);
  }

  enterText(text:string):void{
    this.displayCommands(text);
  }




}

