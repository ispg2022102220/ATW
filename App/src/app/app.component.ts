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
      swim: { hour: total.swim.hour / length, minute: total.swim.minute / length, second: total.swim.second / length },
      bike: { hour: total.bike.hour / length, minute: total.bike.minute / length, second: total.bike.second / length },
      run: { hour: total.run.hour / length, minute: total.run.minute / length, second: total.run.second / length }
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
    return {
      swim: {minute: total.swim.minute / length, second: total.swim.second / length},
      bike: {speed: total.bike.speed / length},
      run: {speed: total.run.speed / length}
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
  
  toggleFeedback()
  {
    const swim_seconds = this.swim_time[0].hour * 3600 + this.swim_time[0].minute * 60 + this.swim_time[0].second > 0;
    const bike_seconds = this.bike_time[0].hour * 3600 + this.bike_time[0].minute * 60 + this.bike_time[0].second > 0;
    const run_seconds = this.run_time[0].hour * 3600 + this.run_time[0].minute * 60 + this.run_time[0].second > 0;
    const interval_01 = this.interval_01[0]['minute'] * 60 + this.interval_01[0]['second'] > 0;
    const interval_02 = this.interval_02[0]['minute'] * 60 + this.interval_02[0]['second'] > 0;

    if (!this.showFeedback)
    {
      if (swim_seconds && bike_seconds && run_seconds && interval_01 && interval_02)
      {
        this.calculateAll();

        this.showFeedback = !this.showFeedback;
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
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 25, 30), bike: new TriathlonTime(1, 15, 0), run: new TriathlonTime(0, 45, 0)},
      {swim: new TriathlonPace_swim(1, 30), bike: new TriathlonPace(25), run: new TriathlonPace(5)},
      new TriathlonTime(2, 25, 30),
      {interval_01: new TriathlonTime(0, 5, 0), interval_02: new TriathlonTime(0, 3, 0)}
    );

    const recorde_02 = this.setRecord(
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 26, 0), bike: new TriathlonTime(1, 20, 0), run: new TriathlonTime(0, 50, 0)},
      {swim: new TriathlonPace_swim(1, 32), bike: new TriathlonPace(24), run: new TriathlonPace(5.5)},
      new TriathlonTime(2, 30, 0),
      {interval_01: new TriathlonTime(0, 5, 30), interval_02: new TriathlonTime(0, 3, 30)}
    );

    const recorde_03 = this.setRecord(
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 24, 0), bike: new TriathlonTime(1, 10, 0), run: new TriathlonTime(0, 40, 0)},
      {swim: new TriathlonPace_swim(1, 28), bike: new TriathlonPace(26), run: new TriathlonPace(4.5)},
      new TriathlonTime(2, 14, 0),
      {interval_01: new TriathlonTime(0, 4, 30), interval_02: new TriathlonTime(0, 2, 30)}
    );

    const recorde_04 = this.setRecord(
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 27, 0), bike: new TriathlonTime(1, 22, 0), run: new TriathlonTime(0, 55, 0)},
      {swim: new TriathlonPace_swim(1, 35), bike: new TriathlonPace(23), run: new TriathlonPace(6)},
      new TriathlonTime(2, 44, 0),
      {interval_01: new TriathlonTime(0, 6, 0), interval_02: new TriathlonTime(0, 3, 30)}
    );

    const recorde_05 = this.setRecord(
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 25, 0), bike: new TriathlonTime(1, 17, 0), run: new TriathlonTime(0, 47, 0)},
      {swim: new TriathlonPace_swim(1, 29), bike: new TriathlonPace(24.5), run: new TriathlonPace(5.2)},
      new TriathlonTime(2, 29, 0),
      {interval_01: new TriathlonTime(0, 5, 15), interval_02: new TriathlonTime(0, 3, 45)}
    );

    return [recorde_05, recorde_04, recorde_03, recorde_02, recorde_01];
  }

  getPreviousThreeRecords()
  {
    const recorde_01 = this.setRecord(
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 25, 30), bike: new TriathlonTime(1, 15, 0), run: new TriathlonTime(0, 45, 0)},
      {swim: new TriathlonPace_swim(1, 30), bike: new TriathlonPace(25), run: new TriathlonPace(5)},
      new TriathlonTime(2, 25, 30),
      {interval_01: new TriathlonTime(0, 5, 0), interval_02: new TriathlonTime(0, 3, 0)}
    );

    const recorde_02 = this.setRecord(
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 26, 0), bike: new TriathlonTime(1, 20, 0), run: new TriathlonTime(0, 50, 0)},
      {swim: new TriathlonPace_swim(1, 32), bike: new TriathlonPace(24), run: new TriathlonPace(5.5)},
      new TriathlonTime(2, 30, 0),
      {interval_01: new TriathlonTime(0, 5, 30), interval_02: new TriathlonTime(0, 3, 30)}
    );

    const recorde_03 = this.setRecord(
      new TriathlonDistance(1500, 40, 10),
      {swim: new TriathlonTime(0, 24, 0), bike: new TriathlonTime(1, 10, 0), run: new TriathlonTime(0, 40, 0)},
      {swim: new TriathlonPace_swim(1, 28), bike: new TriathlonPace(26), run: new TriathlonPace(4.5)},
      new TriathlonTime(2, 14, 0),
      {interval_01: new TriathlonTime(0, 4, 30), interval_02: new TriathlonTime(0, 2, 30)}
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

    // Sprint
    if ( this.distances[0]['swim'] === 750 && this.distances[0]['bike'] === 20000 && this.distances[0]['run'] === 5000 )
    {
      if ( ( this.swim_time[0]['hour'] > 0 ) || ( (this.swim_time[0]['minute'] > 30) || ( (this.swim_time[0]['minute'] == 30) && (this.swim_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de swim máximo");
      }

      if ( ( this.bike_time[0]['hour'] > 2 ) || ( this.bike_time[0]['hour'] == 2 && (this.bike_time[0]['minute'] > 0 || this.bike_time[0]['second'] > 0) ) )
      {
        this.errors.push("tempo de bike máximo");
      }

      if ( ( this.run_time[0]['hour'] > 3) || ( this.run_time[0]['hour'] == 3 && (this.run_time[0]['minute'] > 0 || this.run_time[0]['second'] > 0) ) )
      {
        this.errors.push("tempo de run máximo");
      }
    }

    // Olympic
    if ( this.distances[0]['swim'] === 1500 && this.distances[0]['bike'] === 40000 && this.distances[0]['run'] === 10000 )
    {
      if ( (this.swim_time[0]['hour'] > 1) || ( this.swim_time[0]['hour'] == 1 && (this.swim_time[0]['minute'] > 0 || this.swim_time[0]['second'] > 0) ) )
      {
        this.errors.push("tempo de swim máximo");
      }
   
      if ( (this.bike_time[0]['hour'] > 3) || ( this.bike_time[0]['hour'] == 3 && (this.bike_time[0]['minute'] > 15 || (this.bike_time[0]['minute'] == 15 && this.bike_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de bike máximo");
      }

      if ( (this.run_time[0]['hour'] > 4) || ( this.run_time[0]['hour'] == 4 && (this.run_time[0]['minute'] > 30 || (this.run_time[0]['minute'] == 30 && this.run_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de corrida máximo");
      }
    }

    // Half-Ironman
    if ( this.distances[0]['swim'] === 1900 && this.distances[0]['bike'] === 90000 && this.distances[0]['run'] === 21100 )
    {
      if ( (this.swim_time[0]['hour'] > 1) || ( this.swim_time[0]['hour'] == 1 && (this.swim_time[0]['minute'] > 10 || (this.swim_time[0]['minute'] == 10 && this.swim_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de swim máximo");
      }

      if ( (this.bike_time[0]['hour'] > 5) || ( this.bike_time[0]['hour'] == 5 && (this.bike_time[0]['minute'] > 30 || (this.bike_time[0]['minute'] == 30 && this.bike_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de bike máximo");
      }

      if ( (this.run_time[0]['hour'] > 8) || ( this.run_time[0]['hour'] == 8 && (this.run_time[0]['minute'] > 30 || (this.run_time[0]['minute'] == 30 && this.run_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de corrida máximo");
      }
    }

    // Ironman
    if ( this.distances[0]['swim'] === 3800 && this.distances[0]['bike'] === 180000 && this.distances[0]['run'] === 42195 )
    {
      if ( this.swim_time[0]['hour'] > 2 || ( this.swim_time[0]['hour'] == 2 && (this.swim_time[0]['minute'] > 20 || (this.swim_time[0]['minute'] == 20 && this.swim_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de swim máximo");
      }

      if ( this.bike_time[0]['hour'] > 10 || ( this.bike_time[0]['hour'] == 10 && (this.bike_time[0]['minute'] > 30 || (this.bike_time[0]['minute'] == 30 && this.bike_time[0]['second'] > 0) ) ) )
      {
        this.errors.push("tempo de bike máximo");
      }

      if ( this.run_time[0]['hour'] > 17 || ( this.run_time[0]['hour'] == 17 && (this.run_time[0]['minute'] > 0 || this.run_time[0]['second'] > 0) ) )
      {
        this.errors.push("tempo de corrida máximo");
      }
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
