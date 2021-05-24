import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Paho } from 'ng2-mqtt/mqttws31';
import { request } from 'http';
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
  commandAmount: number = 50;
  data: string = '';
  topic: string = '';
  model: any;
  client: any;
  base = 'x6et/q8zl/'
  leaderboard = 'x6et/q8zl/game/leaderboard'
  mqttbroker = 'broker.mqttdashboard.com';
  timeText: string = "";
  weatherText: string = "";
  hideBrowser = true;
  commands: string[] = [
    " _____            _                     _      ____        \n" +
    "|  __ \\          | |                   | |    / __ \\       \n" +
    "| |__) |   ___   | |__     ___   _ __  | |_  | |  | |  ___ \n" +
    "|  _  /   / _ \\  | '_ \\   / _ \\ | '__| | __| | |  | | / __|\n" +
    "| | \\ \\  | (_) | | |_) | |  __/ | |    | |_  | |__| | \\___\ \n" +
    "|_|  \\_\\  \\___/  |_.__/   \\___| |_|     \\__|  \\____/  |___/ \n",
    "This is the Mqtt Request Terminal here you will see the requests,\n" +
    "that will be sent from this client or recevied from the Database"
  ];
  showText = true;
  currentlyWaitingFor: string = "";
  url: string = "";
  urlSafe: SafeResourceUrl = "";
  urlWeather: SafeResourceUrl = "";
  pos = [
    //row 1
    { x: 10, y: 20 },
    { x: 20, y: 20 },
    { x: 30, y: 20 },
    //row 2
    { x: 10, y: 30 },
    { x: 20, y: 30 },
    { x: 40, y: 30 },
    //
    { x: 10, y: 40 },
    { x: 20, y: 40 },
    { x: 40, y: 40 },
  ];
  browser = { x: 520, y: 140 };
  ngOnInit() {
    //mqtt
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(8000), 'wxview');
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.client.connect({ onSuccess: this.onConnect.bind(this) });

    //other
    //timer
    this.setTimeText();
    setInterval(() => { this.setTimeText() }, 1000);
    //url bypass
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }


  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }



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
    this.topic = message.destinationName
    if (!this.topic.includes(this.currentlyWaitingFor))
      return;
    this.data = message.payloadString



    this.model = <LeadData[]>JSON.parse(this.data)
    this.model = this.model.data;
    this.displayCommands("GetRequest: " + this.topic);
  }

  changeLeaderboard = (index: number): void => {
    this.level = index;
    this.sendMessage(this.level);
    this.displayCommands("SendRequest: " + this.base + "get/leaderboard ----> data: " + this.level);
  }

  sendMessage(level: number) {
    let packet = new Paho.MQTT.Message(level + "");
    this.currentlyWaitingFor = level + "";
    console.log(this.base + "get/Leaderboard")
    //x6et/q8zl/get/Leaderboard/#
    //x6et/q8zl/get/Leaderboard/2
    packet.destinationName = this.base + "get/leaderboard";
    this.client.send(packet);

  }

  displayCommands(command: string) {
    this.commands.push(command)
    if (this.commands.length > this.commandAmount)
      this.commands = this.commands.slice(1, this.commandAmount + 1);
  }

  enterText(text: string): void {
    this.displayCommands(text);
    text = text.toLocaleLowerCase();
    switch (text) {
      case "hi":
      case "hello":
      case "hallo":
        this.displayCommands("> hello user!")
        break;
      case "ping":
        this.displayCommands("> pong!")
        break;
      case "clear":
      case "cls":
        this.commands = [];
        break;
      case "1":
      case "easy":
      case "level --1":
        this.changeLeaderboard(0);
        break;
      case "2":
      case "level --2":
      case "normal":
        this.changeLeaderboard(1);
        break;
      case "3":
      case "level --3":
      case "hard":
        this.changeLeaderboard(2);
        break;
      case "4":
      case "level --4":
      case "extreme":
        this.changeLeaderboard(3);
        break;
      case "5":
      case "level --5":
      case "crazy":
        this.changeLeaderboard(4);
        break;
      case "help":
        this.displayCommands(
          "******************\n" +
          "*   Help   Page  *\n" +
          "******************\n" +
          "> level --1  --> Switch to Easy Mode\n" +
          "> level --2  --> Switch to Normal Mode\n" +
          "> level --3  --> Switch to Hard Mode\n" +
          "> level --4  --> Switch to Extreme Mode\n" +
          "> level --5  --> Switch to Crazy Mode\n" +
          "> ping       --> pong!\n" +
          "> cls        --> Clear screen\n" +
          "> time       --> Get current time\n" +
          "> moodle     --> Open moodle.com\n" +
          "> spieleaffe --> Open spieleaffe.de\n" +
          "> amazon     --> Open amazon.com\n" +
          "> reload     --> Reload website\n" +
          "> hello      --> hello !"
        )
        break;
      case "time":
        let time = new Date()
        this.displayCommands("> "+time.toLocaleDateString() + this.getTime());
        break;
      case "moodle":
        this.moodle();
        break;
      case "amazon":
        this.amazon();
        break;
      case "spieleaffe":
        this.spieleaffe();
        break;
      case "reload":
      case "rl":
        window.location.reload();
      break;
      default:
        this.displayCommands("> Command not found type 'help' for further information")
        break;
    }

  }

  weather() {
    this.url = "https://www.accuweather.com/de/at/leonding/23554/weather-forecast/23554"
    this.input = "input"
    this.hideBrowser = false;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  moodle() {
    this.url = "https://edufs.edu.htl-leonding.ac.at/moodle/login/index.php"
    window.open(this.url, "_blank")?.focus();
  }

  input: string = "input"
  amazon() {
    this.input = "noInput"
    this.hideBrowser = false;
    this.url = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0"
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url); 2
  }

  spieleaffe() {
    this.input = "input"
    this.hideBrowser = false;
    this.url = "https://www.spielaffe.de"
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  getTime() {
    let time = new Date()
    return (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) + ":" +
      (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getHours()) + ":" +
      (time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds() + " ")
  }

  setTimeText() {
    this.timeText = this.getTime();
  }



}

