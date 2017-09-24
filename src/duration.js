'use strict';

const toInt = value => parseInt(value || '0', 10);
const clone = value => {
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }

  return new Date(+value);
};
const parser = /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/;
const dateMethods = new Map([
  ['year', 'FullYear'],
  ['month', 'Month'],
  ['week', 'Date'],
  ['day', 'Date'],
  ['hour', 'UTCHours'],
  ['minute', 'UTCMinutes'],
  ['second', 'UTCSeconds']
]);

export default function createDuration (iso) {
  iso = iso || '';

  if (iso && iso.length > 0 && iso[0] !== 'P') {
    throw new Error(`Invalid duration: ${iso}`);
  }

  let [, ...parts] = iso.match(parser) || [0, 0, 0, 0, 0, 0, 0, 0];

  let [year, month, week, day, hour, minute, second] = parts.map(toInt);

  if (week) {
    week = week * 7;
  }

  parts = {year, month, week, day, hour, minute, second};

  return Object.freeze({
    toString: () =>
      `P${(year ? `${year}Y` : '')}${(month ? `${month}M` : '')}${(week ? `${week / 7}W` : '')}${(day ? `${day}D` : '')}${
        (hour || minute || second
          ? `T${(hour ? `${hour}H` : '')}${(minute ? `${minute}M` : '')}${(second ? `${second}S` : '')}`
          : ''
        )}`,
    addTo: date => {
      let d = clone(date);

      for (let [key, method] of dateMethods) {
        if (parts[key]) {
          d[`set${method}`](d[`get${method}`]() + parts[key]);
        }
      }

      return d;
    },
    subtractFrom: date => {
      let d = clone(date);

      for (let [key, method] of dateMethods) {
        if (parts[key]) {
          d[`set${method}`](d[`get${method}`]() - parts[key]);
        }
      }

      return d;
    }
  });
}
