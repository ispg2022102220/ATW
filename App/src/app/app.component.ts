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
  errors: string[] = [];

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
  
  goal_result : TriathlonGoal = new TriathlonGoal(
    new TriathlonDistance(0,0,0), 
    {swim: new TriathlonTime(0,0,0), run: new TriathlonTime(0,0,0), bike: new TriathlonTime(0,0,0)}, 
    {swim: new TriathlonPace_swim(0,0), run: new TriathlonPace(0), bike: new TriathlonPace(0)}, 
    this.total_time, 
    {interval_01: new TriathlonInterval(0,0), interval_02: new TriathlonInterval(0,0)}
  );

  swim_distance = this.distances[0]['swim'];
  bike_distance = this.distances[0]['bike'];
  run_distance = this.distances[0]['run'];

  //Flags that change css
  buttonClicked_sprint = false;
  buttonClicked_olympic = false;
  buttonClicked_halfIronman = false;
  buttonClicked_ironman = false;
  showWarning = false;
  saveGoal = false;
  showFeedback = false;

  previous_03: TriathlonGoal[] = this.getPreviousThreeRecords();
  previous_05: TriathlonGoal[] = this.getPreviousFiveRecords();

  averageTimeGoal: {swim: TriathlonTime, bike: TriathlonTime, run: TriathlonTime} =
  {
    swim: {hour: 0, minute: 0, second: 0},
    bike: {hour: 0, minute: 0, second: 0},
    run: {hour: 0, minute: 0, second: 0}
  };

  averageTimePrevious03: {swim: TriathlonTime, bike: TriathlonTime, run: TriathlonTime} =
  {
    swim: {hour: 0, minute: 0, second: 0},
    bike: {hour: 0, minute: 0, second: 0},
    run: {hour: 0, minute: 0, second: 0}
  };

  averageTimePrevious05: {swim: TriathlonTime, bike: TriathlonTime, run: TriathlonTime} =
  {
    swim: {hour: 0, minute: 0, second: 0},
    bike: {hour: 0, minute: 0, second: 0},
    run: {hour: 0, minute: 0, second: 0}
  };

  averagePaceGoal: {swim: TriathlonPace_swim, bike: TriathlonPace, run: TriathlonPace} =
  {
    swim: {minute: 0, second: 0},
    bike: {speed: 0},
    run: {speed: 0}
  };

  averagePacePrevious03: {swim: TriathlonPace_swim, bike: TriathlonPace, run: TriathlonPace} = {
    swim: {minute: 0, second: 0},
    bike: {speed: 0},
    run: {speed: 0}
  };

  averagePacePrevious05: {swim: TriathlonPace_swim, bike: TriathlonPace, run: TriathlonPace} = {
    swim: {minute: 0, second: 0},
    bike: {speed: 0},
    run: {speed: 0}
  };

  calculateAverageTime(records: TriathlonGoal[]): {swim: TriathlonTime, bike: TriathlonTime, run: TriathlonTime}
  {
    const total = {swim: {hour: 0, minute: 0, second: 0}, bike: {hour: 0, minute: 0, second: 0}, run: {hour: 0, minute: 0, second: 0}};
    records.forEach(record => {
      total.swim.hour += record.time.swim.hour;
      total.swim.minute += record.time.swim.minute;
      total.swim.second += record.time.swim.second;
      total.bike.hour += record.time.bike.hour;
      total.bike.minute += record.time.bike.minute;
      total.bike.second += record.time.bike.second;
      total.run.hour += record.time.run.hour;
      total.run.minute += record.time.run.minute;
      total.run.second += record.time.run.second;
    });
    
    const length = records.length;
    return {
      swim:
      {
        hour: Math.floor(total.swim.hour / length),
        minute: Math.floor((total.swim.minute + (total.swim.second / 60)) / length),
        second: Math.round(((total.swim.minute * 60 + total.swim.second) / length) % 60)
      },
      bike:
      {
          hour: Math.floor(total.bike.hour / length),
          minute: Math.floor((total.bike.minute + (total.bike.second / 60)) / length),
          second: Math.round(((total.bike.minute * 60 + total.bike.second) / length) % 60)
      },
      run:
      {
          hour: Math.floor(total.run.hour / length),
          minute: Math.floor((total.run.minute + (total.run.second / 60)) / length),
          second: Math.round(((total.run.minute * 60 + total.run.second) / length) % 60)
      }
    };
  }

  calculateAveragePace(records: TriathlonGoal[]): {swim: TriathlonPace_swim, bike: TriathlonPace, run: TriathlonPace}
  {
    const total = {swim: {minute: 0, second: 0}, bike: {speed: 0}, run: {speed: 0}};
    records.forEach(record =>
    {
      total.swim.minute += record.pace.swim.minute;
      total.swim.second += record.pace.swim.second;
      total.bike.speed += record.pace.bike.speed;
      total.run.speed += record.pace.run.speed;
    });

    const length = records.length;

    const averageSwimTotalSeconds = (total.swim.minute * 60 + total.swim.second) / length;
    const averageSwimMinutes = Math.floor(averageSwimTotalSeconds / 60);
    const averageSwimSeconds = Math.round(averageSwimTotalSeconds % 60);

    const averageBikeSpeed = (total.bike.speed / length).toFixed(2);
    const averageRunSpeed = (total.run.speed / length).toFixed(2);

    return {
        swim:
        {
          minute: averageSwimMinutes,
          second: averageSwimSeconds
        },
        bike:
        {
          speed: parseFloat(averageBikeSpeed)
        },
        run:
        {
          speed: parseFloat(averageRunSpeed)
        }
    };
  }

  calculateTimePercentageDifference(currentTime: TriathlonTime, averageTime: TriathlonTime): string
  {
    const currentTotalSeconds = currentTime.hour * 3600 + currentTime.minute * 60 + currentTime.second;
    const averageTotalSeconds = averageTime.hour * 3600 + averageTime.minute * 60 + averageTime.second;
    const difference = ((currentTotalSeconds - averageTotalSeconds) / averageTotalSeconds) * 100;

    return difference.toFixed(2);
  }

  calculateAverageTimePercentageDifference03()
  {
    const swimTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.swim_time[0], this.averageTimePrevious03['swim']));
    const bikeTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.bike_time[0], this.averageTimePrevious03['bike']));
    const runTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.run_time[0], this.averageTimePrevious03['run']));

    const total = swimTimeDifference + bikeTimeDifference + runTimeDifference;
    return parseFloat((total / 3).toFixed(2))
  }

  calculateAverageTimePercentageDifference05()
  {
    const swimTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.swim_time[0], this.averageTimePrevious05['swim']));
    const bikeTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.bike_time[0], this.averageTimePrevious05['bike']));
    const runTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.run_time[0], this.averageTimePrevious05['run']));

    const total = swimTimeDifference + bikeTimeDifference + runTimeDifference;
    return parseFloat((total / 3).toFixed(2))
  }

  calculateAverageTimePercentageDifferenceGoal()
  {
    const swimTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.swim_time[0], this.averageTimeGoal['swim']));
    const bikeTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.bike_time[0], this.averageTimeGoal['bike']));
    const runTimeDifference = parseFloat(this.calculateTimePercentageDifference(this.run_time[0], this.averageTimeGoal['run']));

    const total = swimTimeDifference + bikeTimeDifference + runTimeDifference;
    return parseFloat((total / 3).toFixed(2))
  }

  calculatePacePercentageDifference(currentPace: TriathlonPace | TriathlonPace_swim, averagePace: TriathlonPace | TriathlonPace_swim): string
  {
    if ('speed' in currentPace && 'speed' in averagePace)
    {
      const difference = ((currentPace.speed - averagePace.speed) / averagePace.speed) * 100;

      return difference.toFixed(2);
    }
    else if ('minute' in currentPace && 'minute' in averagePace)
    {
      const currentTotalSeconds = currentPace.minute * 60 + currentPace.second;
      const averageTotalSeconds = averagePace.minute * 60 + averagePace.second;
      const difference = ((currentTotalSeconds - averageTotalSeconds) / averageTotalSeconds) * 100;

      return difference.toFixed(2);
    }

    return '0.00';
  }

  calculateAveragePacePercentageDifference03()
  {
    const swimPaceDifference = parseFloat(this.calculatePacePercentageDifference(this.swim_pace[0], this.averagePacePrevious03['swim']));
    const bikePaceDifference = parseFloat(this.calculatePacePercentageDifference({ speed: this.bike_pace[0]['speed'] }, this.averagePacePrevious03['bike']));
    const runPaceDifference = parseFloat(this.calculatePacePercentageDifference({ speed: this.run_pace[0]['speed'] }, this.averagePacePrevious03['run']));

    const total = swimPaceDifference + bikePaceDifference + runPaceDifference;
    return parseFloat((total / 3).toFixed(2))
  }

  calculateAveragePacePercentageDifference05()
  {
    const swimPaceDifference = parseFloat(this.calculatePacePercentageDifference(this.swim_pace[0], this.averagePacePrevious05['swim']));
    const bikePaceDifference = parseFloat(this.calculatePacePercentageDifference({ speed: this.bike_pace[0]['speed'] }, this.averagePacePrevious05['bike']));
    const runPaceDifference = parseFloat(this.calculatePacePercentageDifference({ speed: this.run_pace[0]['speed'] }, this.averagePacePrevious05['run']));

    const total = swimPaceDifference + bikePaceDifference + runPaceDifference;
    return parseFloat((total / 3).toFixed(2))
  }

  calculateAveragePacePercentageDifferenceGoal()
  {
    const swimPaceDifference = parseFloat(this.calculatePacePercentageDifference(this.swim_pace[0], this.averagePaceGoal['swim']));
    const bikePaceDifference = parseFloat(this.calculatePacePercentageDifference({ speed: this.bike_pace[0]['speed'] }, this.averagePaceGoal['bike']));
    const runPaceDifference = parseFloat(this.calculatePacePercentageDifference({ speed: this.run_pace[0]['speed'] }, this.averagePaceGoal['run']));

    const total = swimPaceDifference + bikePaceDifference + runPaceDifference;
    return parseFloat((total / 3).toFixed(2))
  }

  calculateTimeDifference(currentTime: TriathlonTime[], averageTime: TriathlonTime): string {
    const currentTotalSeconds = currentTime[0].hour * 3600 + currentTime[0].minute * 60 + currentTime[0].second;
    const averageTotalSeconds = averageTime.hour * 3600 + averageTime.minute * 60 + averageTime.second;
    const differenceInSeconds = currentTotalSeconds - averageTotalSeconds;

    const hours = Math.floor(differenceInSeconds / 3600);
    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
    const seconds = differenceInSeconds % 60;

    return `${hours}h ${Math.abs(minutes).toFixed(0)}m ${Math.abs(seconds).toFixed(0)}s`;
  }

  calculatePaceDifferenceSwim(currentPace: TriathlonPace_swim[], averagePace: TriathlonPace_swim): string {
    const currentTotalSeconds = currentPace[0].minute * 60 + currentPace[0].second;
    const averageTotalSeconds = averagePace.minute * 60 + averagePace.second;
    const differenceInSeconds = currentTotalSeconds - averageTotalSeconds;

    const minutes = Math.floor(differenceInSeconds / 60);
    const seconds = differenceInSeconds % 60;

    return `${minutes.toFixed(0)}m ${Math.abs(seconds).toFixed(0)}s`;
  }

  calculatePaceDifference(currentPace: TriathlonPace[], averagePace: TriathlonPace): String {
    const difference = currentPace[0].speed - averagePace.speed;
    return `${difference.toFixed(0)} m/s`;
  }
  
  toggleFeedback()
  {
    const swim_seconds = this.swim_time[0].hour * 3600 + this.swim_time[0].minute * 60 + this.swim_time[0].second > 0;
    const bike_seconds = this.bike_time[0].hour * 3600 + this.bike_time[0].minute * 60 + this.bike_time[0].second > 0;
    const run_seconds = this.run_time[0].hour * 3600 + this.run_time[0].minute * 60 + this.run_time[0].second > 0;
    const interval_01 = this.interval_01[0]['minute'] * 60 + this.interval_01[0]['second'] > 0;
    const interval_02 = this.interval_02[0]['minute'] * 60 + this.interval_02[0]['second'] > 0;
    const distance_flag = this.distances[0]['swim'] > 0 && this.distances[0]['run'] > 0 && this.distances[0]['bike'] > 0;

     
      if (!this.showFeedback)
      {
        if (swim_seconds && bike_seconds && run_seconds && interval_01 && interval_02 && distance_flag)
        {
          if (this.errors.length > 0) {
            this.errors.push('Please, correct the errors to set a feedback');
          } else {
            this.calculateAll();
            this.showFeedback = !this.showFeedback;
          }
        } else {
          if (this.errors.length = 1) {
            this.errors.length = 0;
            this.errors.push('All inputs must be filled');
          } else {
            this.errors.push('All inputs must be filled');
          }
        }
      }
      else
      {
        this.showFeedback = !this.showFeedback;
      }
  }

  calculateAll()
  {
    this.averageTimePrevious03 = this.calculateAverageTime(this.previous_03);
    this.averagePacePrevious03 = this.calculateAveragePace(this.previous_03);

    this.averageTimePrevious05 = this.calculateAverageTime(this.previous_05);
    this.averagePacePrevious05 = this.calculateAveragePace(this.previous_05);
    
    this.averageTimeGoal = this.calculateAverageTime([this.goal_result]);
    this.averagePaceGoal = this.calculateAveragePace([this.goal_result]);
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

  //Adicionar a lista dos ultimos 5 com unshift para adicionar no inicio
  getPreviousFiveRecords()
  {
    const recorde_01 = this.setRecord(
      new TriathlonDistance(750, 2000, 5000),
      {swim: new TriathlonTime(0, 30, 0), bike: new TriathlonTime(0, 40, 0), run: new TriathlonTime(0, 25, 0)},
      {swim: new TriathlonPace_swim(2, 0), bike: new TriathlonPace(8.33), run: new TriathlonPace(3.33)},
      new TriathlonTime(1, 40, 0),
      {interval_01: new TriathlonTime(0, 2, 0), interval_02: new TriathlonTime(0, 3, 0)}
    );

    const recorde_02 = this.setRecord(
      new TriathlonDistance(1500, 40000, 10000),
      {swim: new TriathlonTime(1, 5, 0), bike: new TriathlonTime(1, 25, 0), run: new TriathlonTime(0, 55, 0)},
      {swim: new TriathlonPace_swim(2, 10), bike: new TriathlonPace(7.84), run: new TriathlonPace(3.03)},
      new TriathlonTime(3, 34, 19),
      {interval_01: new TriathlonTime(0, 5, 33), interval_02: new TriathlonTime(0, 3, 46)}
    );

    const recorde_03 = this.setRecord(
      new TriathlonDistance(1900, 90000, 21100),
      {swim: new TriathlonTime(1, 8, 0), bike: new TriathlonTime(3, 20, 0), run: new TriathlonTime(2, 7, 0)},
      {swim: new TriathlonPace_swim(1, 47), bike: new TriathlonPace(7.5), run: new TriathlonPace(2.77)},
      new TriathlonTime(6, 56, 20),
      {interval_01: new TriathlonTime(0, 9, 50), interval_02: new TriathlonTime(0, 11, 30)}
    );

    const recorde_04 = this.setRecord(
      new TriathlonDistance(3800, 180000, 42195),
      {swim: new TriathlonTime(2, 10, 0), bike: new TriathlonTime(7, 12, 0), run: new TriathlonTime(4, 34, 0)},
      {swim: new TriathlonPace_swim(1, 43), bike: new TriathlonPace(6.94), run: new TriathlonPace(2.57)},
      new TriathlonTime(14, 13, 30),
      {interval_01: new TriathlonTime(0, 8, 0), interval_02: new TriathlonTime(0, 9, 30)}
    );

    const recorde_05 = this.setRecord(
      new TriathlonDistance(750, 20000, 5000),
      {swim: new TriathlonTime(0, 28, 0), bike: new TriathlonTime(0, 43, 0), run: new TriathlonTime(0, 27, 0)},
      {swim: new TriathlonPace_swim(1, 52), bike: new TriathlonPace(7.75), run: new TriathlonPace(3.09)},
      new TriathlonTime(1, 41, 33),
      {interval_01: new TriathlonTime(0, 1, 20), interval_02: new TriathlonTime(0, 2, 13)}
    );

    return [recorde_05, recorde_04, recorde_03, recorde_02, recorde_01];
  }

  getPreviousThreeRecords()
  {
    const recorde_01 = this.setRecord(
      new TriathlonDistance(750, 2000, 5000),
      {swim: new TriathlonTime(0, 30, 0), bike: new TriathlonTime(0, 40, 0), run: new TriathlonTime(0, 25, 0)},
      {swim: new TriathlonPace_swim(2, 0), bike: new TriathlonPace(8.33), run: new TriathlonPace(3.33)},
      new TriathlonTime(1, 40, 0),
      {interval_01: new TriathlonTime(0, 2, 0), interval_02: new TriathlonTime(0, 3, 0)}
    );

    const recorde_02 = this.setRecord(
      new TriathlonDistance(1500, 40000, 10000),
      {swim: new TriathlonTime(1, 5, 0), bike: new TriathlonTime(1, 25, 0), run: new TriathlonTime(0, 55, 0)},
      {swim: new TriathlonPace_swim(2, 10), bike: new TriathlonPace(7.84), run: new TriathlonPace(3.03)},
      new TriathlonTime(3, 34, 19),
      {interval_01: new TriathlonTime(0, 5, 33), interval_02: new TriathlonTime(0, 3, 46)}
    );

    const recorde_03 = this.setRecord(
      new TriathlonDistance(1900, 90000, 21100),
      {swim: new TriathlonTime(1, 8, 0), bike: new TriathlonTime(3, 20, 0), run: new TriathlonTime(2, 7, 0)},
      {swim: new TriathlonPace_swim(1, 47), bike: new TriathlonPace(7.5), run: new TriathlonPace(2.77)},
      new TriathlonTime(6, 56, 20),
      {interval_01: new TriathlonTime(0, 9, 50), interval_02: new TriathlonTime(0, 11, 30)}
    );

    return [recorde_03, recorde_02, recorde_01];
  }

  setRecord(distance : TriathlonDistance, 
      time : {swim: TriathlonTime, bike: TriathlonTime, run: TriathlonTime}, 
      pace : {swim: TriathlonPace_swim, bike: TriathlonPace, run: TriathlonPace}, 
      total_time : TriathlonTime, 
      interval : {interval_01: TriathlonInterval, interval_02: TriathlonInterval})
  {

    const record: TriathlonGoal = new TriathlonGoal(
      distance,
      time,
      pace,
      total_time,
      interval,
    );
    
    return record;

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
      if (this.errors.length > 0) {
        this.errors.push('Please, correct the errors to set a feedback');
      } else {
        // Insert Interval
        const interval1: TriathlonInterval = new TriathlonInterval(this.interval_01[0]['minute'], this.interval_01[0]['second']);
        const interval2: TriathlonInterval = new TriathlonInterval(this.interval_02[0]['minute'], this.interval_02[0]['second']);

        this.goal_result['interval']['interval_01'] = interval1;
        this.goal_result['interval']['interval_02'] = interval2;

        // Insert Distance
        this.goal_result['distance']['swim'] = this.swim_distance;
        this.goal_result['distance']['bike'] = this.bike_distance;
        this.goal_result['distance']['run'] = this.run_distance;
    
        // Insert Time
        const swimTime: TriathlonTime = new TriathlonTime(this.swim_time[0]['hour'], this.swim_time[0]['minute'], this.swim_time[0]['second']);
        const bikeTime: TriathlonTime = new TriathlonTime(this.bike_time[0]['hour'], this.bike_time[0]['minute'], this.bike_time[0]['second']);
        const runTime: TriathlonTime = new TriathlonTime(this.run_time[0]['hour'], this.run_time[0]['minute'], this.run_time[0]['second']);

        this.goal_result['time']['swim'] = swimTime;
        this.goal_result['time']['bike'] = bikeTime;
        this.goal_result['time']['run'] = runTime;

        // Insert Pace
        const swimPace: TriathlonPace_swim = new TriathlonPace_swim(this.swim_pace[0]['minute'], this.swim_pace[0]['second']);
        const bikePace: TriathlonPace = new TriathlonPace(this.bike_pace[0]['speed']);
        const runPace: TriathlonPace = new TriathlonPace(this.run_pace[0]['speed']);

        this.goal_result['pace']['swim'] = swimPace;
        this.goal_result['pace']['bike'] = bikePace;
        this.goal_result['pace']['run'] = runPace;
    
        this.saveGoal = !this.saveGoal;

        this.calculateAll();
      }
    } else {
      if (this.errors.length >= 0) {
        if (this.errors.length = 1) {
          this.errors.length = 0;
          this.errors.push('All inputs must be filled');
        } else {
          this.errors.push('All inputs must be filled');
        }
      }
    }
  }

  removeGoal()
  {
    this.goal_result['distance'].bike = 0;
    this.saveGoal = !this.saveGoal;
    console.log(this.goal_result);

    this.calculateAll();
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
    this.errors['length'] = 0;

    // Hours
    if ( ( this.swim_time[0]['hour'] < 0 ) || ( this.bike_time[0]['hour'] < 0 ) || ( this.run_time[0]['hour'] < 0 ) )
    {
      this.errors.push("Invalid Hour");
    }

    // Minutes
    if ( ( this.swim_time[0]['minute'] > 59 || this.swim_time[0]['minute'] < 0 ) || ( this.bike_time[0]['minute'] > 59 || this.bike_time[0]['minute'] < 0 ) || ( this.run_time[0]['minute'] > 59 || this.run_time[0]['minute'] < 0 ) )
    {
      this.errors.push("Invalid minute");
    }

    // Seconds
    if ( ( this.swim_time[0]['second'] > 59 || this.swim_time[0]['second'] < 0 ) || ( this.bike_time[0]['second'] > 59 || this.bike_time[0]['second'] < 0 ) || ( this.run_time[0]['second'] > 59 || this.run_time[0]['second'] < 0 ) || ( this.interval_01[0]['second'] < 0 || this.interval_01[0]['second'] > 59 ) || ( this.interval_02[0]['second'] < 0 || this.interval_02[0]['second'] > 59 ) )
    {
      this.errors.push("Invalid Second");
    }

    // Sprint
    if ( this.distances[0]['swim'] === 750 && this.distances[0]['bike'] === 20000 && this.distances[0]['run'] === 5000 )
    {
      if ( ( this.swim_time[0]['hour'] > 0 ) || ( (this.swim_time[0]['minute'] > 30) || ( (this.swim_time[0]['minute'] == 30) && (this.swim_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum swim time exceeded");
      }

      if ( ( this.bike_time[0]['hour'] > 2 ) || ( this.bike_time[0]['hour'] == 2 && (this.bike_time[0]['minute'] > 0 || this.bike_time[0]['second'] > 0) ) )
      {
        this.errors.push("Maximum bike time exceeded");
      }

      if ( ( this.run_time[0]['hour'] > 3) || ( this.run_time[0]['hour'] == 3 && (this.run_time[0]['minute'] > 0 || this.run_time[0]['second'] > 0) ) )
      {
        this.errors.push("Maximum run time exceeded");
      }
    }

    // Olympic
    if ( this.distances[0]['swim'] === 1500 && this.distances[0]['bike'] === 40000 && this.distances[0]['run'] === 10000 )
    {
      if ( (this.swim_time[0]['hour'] > 1) || ( this.swim_time[0]['hour'] == 1 && (this.swim_time[0]['minute'] > 0 || this.swim_time[0]['second'] > 0) ) )
      {
        this.errors.push("Maximum swim time exceeded");
      }
   
      if ( (this.bike_time[0]['hour'] > 3) || ( this.bike_time[0]['hour'] == 3 && (this.bike_time[0]['minute'] > 15 || (this.bike_time[0]['minute'] == 15 && this.bike_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum bike time exceeded");
      }

      if ( (this.run_time[0]['hour'] > 4) || ( this.run_time[0]['hour'] == 4 && (this.run_time[0]['minute'] > 30 || (this.run_time[0]['minute'] == 30 && this.run_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum run time exceeded");
      }
    }

    // Half-Ironman
    if ( this.distances[0]['swim'] === 1900 && this.distances[0]['bike'] === 90000 && this.distances[0]['run'] === 21100 )
    {
      if ( (this.swim_time[0]['hour'] > 1) || ( this.swim_time[0]['hour'] == 1 && (this.swim_time[0]['minute'] > 10 || (this.swim_time[0]['minute'] == 10 && this.swim_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum swim time exceeded");
      }

      if ( (this.bike_time[0]['hour'] > 5) || ( this.bike_time[0]['hour'] == 5 && (this.bike_time[0]['minute'] > 30 || (this.bike_time[0]['minute'] == 30 && this.bike_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum bike time exceeded");
      }

      if ( (this.run_time[0]['hour'] > 8) || ( this.run_time[0]['hour'] == 8 && (this.run_time[0]['minute'] > 30 || (this.run_time[0]['minute'] == 30 && this.run_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum run time exceeded");
      }
    }

    // Ironman
    if ( this.distances[0]['swim'] === 3800 && this.distances[0]['bike'] === 180000 && this.distances[0]['run'] === 42195 )
    {
      if ( this.swim_time[0]['hour'] > 2 || ( this.swim_time[0]['hour'] == 2 && (this.swim_time[0]['minute'] > 20 || (this.swim_time[0]['minute'] == 20 && this.swim_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum swim time exceeded");
      }

      if ( this.bike_time[0]['hour'] > 10 || ( this.bike_time[0]['hour'] == 10 && (this.bike_time[0]['minute'] > 30 || (this.bike_time[0]['minute'] == 30 && this.bike_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("Maximum bike time exceeded");
      }

      if ( this.run_time[0]['hour'] > 17 || ( this.run_time[0]['hour'] == 17 && (this.run_time[0]['minute'] > 0 || this.run_time[0]['second'] > 0) ) )
      {
        this.errors.push("Maximum run time exceeded");
      }
    }

    if (this.errors.length > 0) {
      this.showFeedback = false;
    }

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

    this.calculateAverageTimePercentageDifference05();
    this.calculateAverageTimePercentageDifference03();
    this.calculateAverageTimePercentageDifferenceGoal();
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

    this.valueChange();
  }
}

class TriathlonGoal
{
  constructor(
    public distance : TriathlonDistance,
    public time : {swim: TriathlonTime, bike: TriathlonTime, run: TriathlonTime}, 
    public pace : {swim: TriathlonPace_swim, bike: TriathlonPace, run: TriathlonPace}, 
    public total_time : TriathlonTime, 
    public interval : {interval_01: TriathlonInterval, interval_02: TriathlonInterval}) 
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
