var fs = require('fs');
var moment = require('moment');

var fileName = 'survillance_times_day4_1_input.txt';

var contents = fs.readFileSync(fileName, 'utf8').toString().split("\n");

var guardSchedules = [];

contents.forEach((elm) => {
  elmSplit = elm.split(';');
  date = elmSplit[0];
  time = elmSplit[1];
  status = elmSplit[2];

  guardSchedules.push({
    date,
    time,
    status,
    id: elmSplit[3] || null
  });
});

// Sort all the guard schedules by date in choronological order
guardSchedules.sort((a, b) => {
  var momentIsGreater = moment(a.date).isBefore(b.date);

  if (!momentIsGreater) {
    if (moment(a.date).isSame(b.date)) {
      return 0;
    }
    return 1;
  } else {
    return -1;
  }
});

const splitHourAndMinutes = (time) => {
  var hour = time.split(':')[0];
  var minute = time.split(':')[1];
  return { hour, minute };
};

var datedGuardSchedules = guardSchedules.reduce((acc, schedule) => {
  if (!acc[schedule.date]) {
    acc[schedule.date] = [{
      time: schedule.time,
      status: schedule.status,
      id: schedule.id
    }];
  } else {
    acc[schedule.date].push({
      time: schedule.time,
      status: schedule.status,
      id: schedule.id
    });
  }

  return acc;
}, {});

var dateAndTimeSortedGuardSchedules = Object.keys(datedGuardSchedules).reduce((acc, dateVal) => {
  var dateTimes = datedGuardSchedules[dateVal];
  dateTimes.sort((a,b) => {
    var aHour = a.time.split(':')[0];
    var bHour = b.time.split(':')[0];

    if (aHour < bHour) {
      return -1;
    }
    if (aHour > bHour) {
      return 1;
    }
    return 0;
  });

  dateTimes.sort((a,b) => {
    var aTime = a.time.split(':');
    var aHour = aTime[0];
    var aMinutes = aTime[1];

    var bTime = b.time.split(':');
    var bHour = bTime[0];
    var bMinutes = bTime[1];

    if (aHour != bHour) {
      return 0;
    }

    return aMinutes > bMinutes;
  });

  acc[dateVal] = dateTimes;

  return acc;
}, {});

var guardMinutes = [];
for (var i = 0; i < 60; i++) {
    guardMinutes.push(i);
}

var _id = null;
var _status = null;

var midnightSchedules = Object.keys(dateAndTimeSortedGuardSchedules).reduce((acc, dateVal, _index) => {
  if (_index == 0) {
    // Record the very first event in this sort-of date relationship, these
    // will change with every new event.
    _id = dateAndTimeSortedGuardSchedules[dateVal][0].id;
    _status = dateAndTimeSortedGuardSchedules[dateVal][0].status;
  }

  var dateTimes = dateAndTimeSortedGuardSchedules[dateVal];

  var postMidnightDateTime = dateTimes.filter((dateTime) => {
    var { hour } = splitHourAndMinutes(dateTime.time);
    if (hour !== '00') {
      return true;
    }
  }).pop();

  var midnightTimes = dateTimes.filter((dateTime) => {
    var { hour } = splitHourAndMinutes(dateTime.time);
    if (hour == '00') {
      return true;
    }
  });

  guardMinutes.forEach((guardMinute) => {
    if (!acc[dateVal]) acc[dateVal] = [];

    midnightTimes.forEach((dateTime) => {
      var { minute } = splitHourAndMinutes(dateTime.time);

      if (Number(minute) == guardMinute) {
        var { id: incomingId, status: incomingStatus } = dateTime;

        // Update the Id and Status according to this new event that fits what we want
        _id = ((incomingId) ? incomingId : _id);
        _status = ((incomingStatus) ? incomingStatus : _status);
      }
    });

    acc[dateVal] = [
      ...acc[dateVal],
      {
        time: guardMinute,
        id: _id,
        status: _status
      }
    ];
  });

  // If there is a guard change late in the day, let's set that for the guard in the next midnight schedule
  _id = ((postMidnightDateTime) ? postMidnightDateTime.id : _id);
  _status = ((postMidnightDateTime) ? postMidnightDateTime.status : _status);

  return acc;
}, {});

const uniqueGuards = new Set();
const guardsSleepSchedules = {};

Object.keys(midnightSchedules).forEach((date) => {
  var dateTimes = midnightSchedules[date];

  dateTimes.forEach((dateTime) => {
    uniqueGuards.add(dateTime.id);
  });
});

for (let guard of uniqueGuards) {
  Object.keys(midnightSchedules).forEach((date) => {
    var dateTimes = midnightSchedules[date];
    dateTimes.reduce((acc, dateTime) => {
      if (dateTime.id == guard && dateTime.status == '#') {
        if (!acc[guard]) acc[guard] = [];

        acc[guard].push(dateTime);
      }

      return acc;
    }, guardsSleepSchedules);
  });
}

var guardSleepTimes = Object.keys(guardsSleepSchedules).map((guardId) => {
  return guardsSleepSchedules[guardId]; // Returns only the guard sleep times
});

var minutesGuardsAreAsleepOn = guardMinutes.reduce((acc, minute) => {
    guardSleepTimes.forEach((sleepSchedule) => {
        sleepSchedule.forEach((sleepyTime) => {
            if (sleepyTime.time == minute) {
                if (!acc[minute]) acc[minute] = { guardInfo: {} };
                if (!acc[minute].guardInfo[sleepyTime.id]) acc[minute].guardInfo[sleepyTime.id] = 0;

                acc[minute].guardInfo[sleepyTime.id] = ++acc[minute].guardInfo[sleepyTime.id];
            }
        });
    });
    return acc;
}, {});

var organizedGuardSleepingMinutes = Object.keys(minutesGuardsAreAsleepOn).reduce((acc, minute) => {
    var guardInfo = minutesGuardsAreAsleepOn[minute].guardInfo;
    acc[minute] = Object.keys(guardInfo).reduce((acc, guardId) => {
        acc.push({
            id: guardId,
            asleepTimes: guardInfo[guardId]
        });
        return acc;
    }, []);
    return acc;
}, {});

var sortedOrganizedGuardSleepingMinutes = Object.keys(organizedGuardSleepingMinutes).map((minute) => {
    var organizedByMinute = organizedGuardSleepingMinutes[minute].sort((a,b) => {
        if (a.asleepTimes == b.asleepTimes) return 0;
        if (a.asleepTimes > b.asleepTimes) return 1;
        if (a.asleepTimes < b.asleepTimes) return -1;
    });
    var mostAsleep = organizedByMinute.pop();
    return {
        [minute]: mostAsleep
    };
});

console.log(sortedOrganizedGuardSleepingMinutes);