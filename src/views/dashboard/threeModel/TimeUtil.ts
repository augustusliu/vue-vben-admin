import moment from "moment";

export class TimeUtil {

  private currentDate: Date;
  constructor() {
    this.currentDate = new Date();
  }

  public getTime(){
    this.currentDate = new Date();
    let timeLong = this.currentDate.getTime();
    return moment(Number(timeLong)).format('YYYY年MM月DD日 HH时mm分ss秒');
  }

}
