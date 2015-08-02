'use strict';

let toInt = (value) => {
    return parseInt(value || '0', 10);
  },
  clone = (value) => {
    if (typeof value === 'object' && typeof value.toDate === 'function') {
      return value.toDate();
    }

    return new Date(+value);
  };

let parser = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;

let dateMethods = new Map([
    ['year', 'UTCFullYear'],
    ['month', 'UTCMonth'],
    ['day', 'UTCDate'],
    ['hour', 'UTCHours'],
    ['minute', 'UTCMinutes'],
    ['second', 'UTCSeconds']
  ]);

export default function createDuration (iso) {
  let [, ...parts] = iso.match(parser),
    [year, month, day, hour, minute, second] = parts.map(toInt);

  parts = {year, month, day, hour, minute, second};

  return Object.freeze({
    toString: () => {
      return `P${(year ? year + 'Y' : '')}${(month ? month + 'M' : '')}${(day ? day + 'D' : '')}${
        (hour || minute || second
          ? `T${(hour ? hour + 'H' : '')}${(minute ? minute + 'M' : '')}${(second ? second + 'S' : '')}`
          : ''
        )}`;
    },
    addTo: (date) => {
      let d = clone(date);

      for (let [key, methodName] of dateMethods) {
        if (parts[key]) {
          d['set' + methodName](d['get' + methodName]() + parts[key]);
        }
      }

      return d;
    },
    subtractFrom: (date) => {
      let d = clone(date);

      for (let [key, methodName] of dateMethods) {
        if (parts[key]) {
          d['set' + methodName](d['get' + methodName]() - parts[key]);
        }
      }

      return d;
    }
  });
}
