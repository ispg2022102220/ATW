import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent  
{
  distances : TriathlonDistance[] = [new TriathlonDistance(0,0,0)];

  swim_time : TriathlonTime[] = [new TriathlonTime(0,0,0)];
  bike_time : TriathlonTime[] = [new TriathlonTime(0,0,0)];
  run_time : TriathlonTime[] = [new TriathlonTime(0,0,0)];

  interval_01 : TriathlonInterval[] = [new TriathlonInterval(0,0)];
  interval_02 : TriathlonInterval[] = [new TriathlonInterval(0,0)];

  swim_pace : TriathlonPace_swim[] = [new TriathlonPace_swim(0,0)];
  bike_pace : TriathlonPace[] = [new TriathlonPace(0)];
  run_pace : TriathlonPace[] = [new TriathlonPace(0)];

  total_time : TriathlonTime = new TriathlonTime(0,0,0);
  goal_result : TriathlonGoal = new TriathlonGoal(0, 0, 0, this.total_time, 0);

  swim_distance = this.distances[0]['swim'];
  bike_distance = this.distances[0]['bike'];
  run_distance = this.distances[0]['run'];

  //Flags that change css
  buttonClicked_sprint = false;
  buttonClicked_olympic = false;
  buttonClicked_halfIronman = false;
  buttonClicked_ironman = false;
  showWarning = false;

  showFeedback = false;

  toggleFeedback() {
    const swim_seconds = this.swim_time[0].hour * 3600 + this.swim_time[0].minute * 60 + this.swim_time[0].second > 0;
    const bike_seconds = this.bike_time[0].hour * 3600 + this.bike_time[0].minute * 60 + this.bike_time[0].second > 0;
    const run_seconds = this.run_time[0].hour * 3600 + this.run_time[0].minute * 60 + this.run_time[0].second > 0;
    const interval_01 = this.interval_01[0]['minute'] * 60 + this.interval_01[0]['second'] > 0;
    const interval_02 = this.interval_02[0]['minute'] * 60 + this.interval_02[0]['second'] > 0;

    if (!this.showFeedback) {
      if (swim_seconds && bike_seconds && run_seconds && interval_01 && interval_02) {
        this.showFeedback = !this.showFeedback;
      }
    } else {
      this.showFeedback = !this.showFeedback;
    }
  }
  
  toggleWarning() {
    this.showWarning = !this.showWarning;
  }

  toggleButton(type : String) {
    switch (type) {
      case 'sprint':
        this.buttonClicked_sprint = true;
        this.buttonClicked_olympic = false;
        this.buttonClicked_halfIronman = false;
        this.buttonClicked_ironman = false;
        break;
      case 'olympic':
        this.buttonClicked_sprint = false;
        this.buttonClicked_olympic = true;
        this.buttonClicked_halfIronman = false;
        this.buttonClicked_ironman = false;
        break;
      case 'halfIronman':
        this.buttonClicked_sprint = false;
        this.buttonClicked_olympic = false;
        this.buttonClicked_halfIronman = true;
        this.buttonClicked_ironman = false;
        break;
      case 'ironman':
        this.buttonClicked_sprint = false;
        this.buttonClicked_olympic = false;
        this.buttonClicked_halfIronman = false;
        this.buttonClicked_ironman = true;
        break;
      case 'deactivate':
        this.buttonClicked_sprint = false;
        this.buttonClicked_olympic = false;
        this.buttonClicked_halfIronman = false;
        this.buttonClicked_ironman = false;
        break;
      default:
        this.buttonClicked_sprint = false;
        this.buttonClicked_olympic = false;
        this.buttonClicked_halfIronman = false;
        this.buttonClicked_ironman = false;
        break;
    }
  }

  setGoal() {
    const swim_seconds = this.swim_time[0].hour * 3600 + this.swim_time[0].minute * 60 + this.swim_time[0].second > 0;
    const bike_seconds = this.bike_time[0].hour * 3600 + this.bike_time[0].minute * 60 + this.bike_time[0].second > 0;
    const run_seconds = this.run_time[0].hour * 3600 + this.run_time[0].minute * 60 + this.run_time[0].second > 0;
    const interval_01 = this.interval_01[0]['minute'] * 60 + this.interval_01[0]['second'] > 0;
    const interval_02 = this.interval_02[0]['minute'] * 60 + this.interval_02[0]['second'] > 0;
    const distance_flag = this.distances[0]['swim'] > 0 && this.distances[0]['run'] > 0 && this.distances[0]['bike'] > 0;

    if (swim_seconds && bike_seconds && run_seconds && interval_01 && interval_02 && distance_flag)
    {
      const interval = {
        interval_01: this.interval_01,
        interval_02: this.interval_02,
      };

      const distance = {
        swim: this.swim_distance,
        bike: this.bike_distance,
        run: this.run_distance,
      }
  
      const time = {
        swim: this.swim_time,
        bike: this.bike_time,
        run: this.run_time,
      }
  
      const pace = {
        swim: this.swim_pace,
        bike: this.bike_pace,
        run: this.run_pace,
      }
  
      this.goal_result['distance'] = distance;
      this.goal_result['time'] = time;
      this.goal_result['pace'] = pace;
      this.goal_result['interval'] = interval;
  
      console.log(this.goal_result);
    }
  }

  totalTimeUpdate() {
    const swim_seconds = this.swim_time[0].hour * 3600 + this.swim_time[0].minute * 60 + this.swim_time[0].second;
    const bike_seconds = this.bike_time[0].hour * 3600 + this.bike_time[0].minute * 60 + this.bike_time[0].second;
    const run_seconds = this.run_time[0].hour * 3600 + this.run_time[0].minute * 60 + this.run_time[0].second;
    const interval_01 = this.interval_01[0]['minute'] * 60 + this.interval_01[0]['second'];
    const interval_02 = this.interval_02[0]['minute'] * 60 + this.interval_02[0]['second'];

    const total_seconds = swim_seconds + bike_seconds + run_seconds + interval_01 + interval_02;

    const hours = Math.floor(total_seconds / 3600);
    const remainingSeconds = total_seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.round(remainingSeconds % 60);

    this.total_time.hour = hours;
    this.total_time.minute = minutes;
    this.total_time.second = seconds;
  }

  valueChange()
  {
    this.checkAndSetDefault_interval(this.interval_01);
    this.checkAndSetDefault_interval(this.interval_02);

    this.checkAndSetDefault_time(this.swim_time);
    this.checkAndSetDefault_time(this.bike_time);
    this.checkAndSetDefault_time(this.run_time);
    
    this.checkAndSetDefault_pace_swim(this.swim_pace);
    this.checkAndSetDefault_pace(this.bike_pace);
    this.checkAndSetDefault_pace(this.run_pace);

    this.update_bike_pace();
    this.update_run_pace();
    this.update_swim_pace();
  }

  distanceChange()
  {
    this.swim_distance = this.distances[0]['swim'];
    this.bike_distance = this.distances[0]['bike'];
    this.run_distance = this.distances[0]['run'];

    this.toggleButton('deactivate');

    this.update_bike_pace();
    this.update_run_pace();
    this.update_swim_pace();
  }

  // Pace input changed
  update_bike_time() {
    const pace_seconds = this.bike_pace[0]['speed'];
    const total_seconds = this.bike_distance / pace_seconds;
  
    const hours = Math.floor(total_seconds / 3600);
    const remainingSeconds = total_seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.round(remainingSeconds % 60);
  
    this.bike_time[0]['hour'] = hours;
    this.bike_time[0]['minute'] = minutes;
    this.bike_time[0]['second'] = seconds;
  }

  // Time input changed
  update_bike_pace() {
    const seconds = this.bike_time[0]['hour'] * 3600 + this.bike_time[0]['minute'] * 60 + this.bike_time[0]['second']; 
    const num = this.bike_distance / seconds; 

    if (seconds > 0 && this.bike_distance != 0) {
      this.bike_pace[0]['speed'] = parseFloat(num.toFixed(2));
    } else {
      this.bike_pace[0]['speed'] = 0;
    }

    this.totalTimeUpdate();
  }

  update_run_time() {
    const pace_seconds = this.run_pace[0]['speed'];
    const total_seconds = this.run_distance / pace_seconds;
  
    const hours = Math.floor(total_seconds / 3600);
    const remainingSeconds = total_seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.round(remainingSeconds % 60);
  
    this.run_time[0]['hour'] = hours;
    this.run_time[0]['minute'] = minutes;
    this.run_time[0]['second'] = seconds;
  }

  update_run_pace() {
    const seconds = this.run_time[0]['hour'] * 3600 + this.run_time[0]['minute'] * 60 + this.run_time[0]['second']; 
    const num = this.run_distance / seconds; 

    if (seconds > 0 && this.run_distance != 0) {
      this.run_pace[0]['speed'] = parseFloat(num.toFixed(2));
    } else {
      this.run_pace[0]['speed'] = 0;
    } 

    this.totalTimeUpdate();
  } 

  update_swim_time() {
    const pace_seconds = (this.swim_pace[0]['minute'] * 60 + this.swim_pace[0]['second']) / 50; // Convert pace to seconds per swim distance
    const total_seconds = this.swim_distance * pace_seconds; // Total seconds for swim distance
  
    const hours = Math.floor(total_seconds / 3600); // Calculate hours
    const remainingSeconds = total_seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60); // Calculate minutes
    const seconds = Math.round(remainingSeconds % 60); // Calculate remaining seconds
  
    this.swim_time[0]['hour'] = hours;
    this.swim_time[0]['minute'] = minutes;
    this.swim_time[0]['second'] = seconds;
  }

  update_swim_pace() {
    const total_seconds = this.swim_time[0]['hour'] * 3600 + this.swim_time[0]['minute'] * 60 + this.swim_time[0]['second'];
    const num_segments = this.swim_distance / 50;
    const pace_per_50m_seconds = total_seconds / num_segments;

    const minutes = Math.floor(pace_per_50m_seconds / 60);
    const seconds = Math.round(pace_per_50m_seconds % 60);

    if (pace_per_50m_seconds > 0 && this.swim_distance != 0) {
      this.swim_pace[0]['minute'] = minutes;
      this.swim_pace[0]['second'] = seconds;
    } else {
      this.swim_pace[0]['minute'] = 0;
      this.swim_pace[0]['second'] = 0;
    }

    this.totalTimeUpdate();
  }

  checkAndSetDefault_time(times: TriathlonTime[]) {
    times.forEach(time => {
      (Object.keys(time) as (keyof TriathlonTime)[]).forEach(key => {
        if (time[key] == null) {
          time[key] = 0;
        }
      });
    });
  }

  checkAndSetDefault_pace(times: TriathlonPace[]) {
    times.forEach(time => {
      (Object.keys(time) as (keyof TriathlonPace)[]).forEach(key => {
        if (time[key] == null) {
          time[key] = 0;
        }
      });
    });
  }

  checkAndSetDefault_pace_swim(times: TriathlonPace_swim[]) {
    times.forEach(time => {
      (Object.keys(time) as (keyof TriathlonPace_swim)[]).forEach(key => {
        if (time[key] == null) {
          time[key] = 0;
        }
      });
    });
  }

  checkAndSetDefault_interval(times: TriathlonInterval[]) {
    times.forEach(time => {
      (Object.keys(time) as (keyof TriathlonInterval)[]).forEach(key => {
        if (time[key] == null) {
          time[key] = 0;
        }
      });
    });
  }

  fillDistance(type : String)
  {
    this.distances.length = 0;

    switch (type)
    {
      case 'sprint':
        this.distances.push(new TriathlonDistance(750, 20000, 5000));
        this.toggleButton('sprint');
        break;
      case 'olympic':
        this.distances.push(new TriathlonDistance(1500, 40000, 10000));
        this.toggleButton('olympic');
        break;
      case 'halfIronman':
        this.distances.push(new TriathlonDistance(1900, 90000, 21100));
        this.toggleButton('halfIronman');
        break;
      case 'ironman':
        this.distances.push(new TriathlonDistance(3800, 180000, 42195));
        this.toggleButton('ironman');
        break;
      default:
        this.distances.length=0;
        break;
    }

    this.swim_distance = this.distances[0]['swim'];
    this.bike_distance = this.distances[0]['bike'];
    this.run_distance = this.distances[0]['run'];

    this.update_swim_pace();
    this.update_bike_pace();
    this.update_run_pace();
  }
}

class TriathlonGoal
{
  constructor(public distance : Object, public time : Object, public pace : Object, public total_time : TriathlonTime, public interval : Object) 
  {
    
  }
}

class TriathlonDistance
{
  constructor(public swim : number, public bike : number, public run : number) {  }
}

class TriathlonTime
{
  constructor(public hour : number, public minute : number, public second : number) {  }
}

class TriathlonInterval
{
  constructor(public minute : number, public second : number) { }
}

class TriathlonPace
{
  constructor(public speed : number) { }
}

class TriathlonPace_swim
{
  constructor(public minute : number, public second : number) { }
}
