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
  commandAmount:number =50;
  data: string = '';
  topic: string = '';
  model: any;
  client: any;
  base = 'x6et/q8zl/'
  leaderboard = 'x6et/q8zl/game/leaderboard'
  mqttbroker = 'broker.mqttdashboard.com';
  timeText:string="";
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

  pos = [
    //row 1
    {x: 10, y: 80},
    {x: 20, y: 80},
    {x: 30, y: 80},
    //row 2
    {x: 10, y: 90},
    {x: 20, y: 90},
    {x: 40, y: 90},
    //
    {x: 10, y: 90},
    {x: 20, y: 90},
    {x: 40, y: 90},
  ];

  ngOnInit() {
    //mqtt
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(8000), 'wxview');
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({ onSuccess: this.onConnect.bind(this) });

    //other
      //timer
      this.setTimeText();
      setInterval(()=> { this.setTimeText() }, 1000);
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

  changeLeaderboard = (index:number): void => {
      this.level = index;
      this.sendMessage(this.level);
      this.displayCommands("SendRequest: "+this.base+"get/leaderboard ----> data: "+this.level);
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
    text = text.toLocaleLowerCase();
    switch(text){
      case "hi":
      case "hello":
      case "hallo":
        this.displayCommands("Hello!")
      break;
      case "ping":
        this.displayCommands("Pong!")
      break;
      case "clear":
      case "cls":
        this.commands=[];
      break;
      case "1":
      case "easy":
        this.changeLeaderboard(0);
      break;
      case "2":
      case "normal":
        this.changeLeaderboard(1);
      break;
      case "3":
      case "hard":
        this.changeLeaderboard(2);
      break;
      case "4":
      case "extreme":
        this.changeLeaderboard(3);
      break;
      case "5":
      case "crazy":
        this.changeLeaderboard(4);
      break;
      case "help":
        this.displayCommands(
          "******************\n"+
          "*   Help   Page  *\n"+
          "******************\n"+
          "> 1     --> Switch to Easy Mode\n"+
          "> 2     --> Switch to Normal Mode\n"+
          "> 3     --> Switch to Hard Mode\n"+
          "> 4     --> Switch to Extreme Mode\n"+
          "> 5     --> Switch to Crazy Mode\n"+
          "> Ping   --> Pong!\n"+
          "> cls    --> Clear screen"
        )
      break;
      case "time":
        let time = new Date()
        this.displayCommands(
          time.toLocaleDateString()+this.getTime());
      break;
      default:
        this.displayCommands("Command not found type 'help' for further information")
      break;
      }

  }

  weather(){
    window.open("https://www.accuweather.com/de/at/leonding/23554/weather-forecast/23554",'_blank')?.focus();
  }

  moodle(){
    window.open("https://edufs.edu.htl-leonding.ac.at/moodle/login/index.php",'_blank')?.focus();
  }

  amazon(){
    window.open("https://amazon.de",'_blank')?.focus();
  }

  getTime(){
    let time = new Date()
    return(time.getHours() <10 ? "0"+time.getHours() : time.getHours())+":"+
          (time.getMinutes() <10 ? "0"+time.getMinutes() : time.getHours())+":"+
          (time.getSeconds() <10 ? "0"+time.getSeconds() : time.getSeconds()+" ")
  }

  setTimeText(){
      this.timeText = this.getTime();
  }




}

