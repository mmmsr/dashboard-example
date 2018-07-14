import * as moment from 'moment'
import 'moment-timezone'

export {
  makeCalendarOfThisMonth,
  makeCalendarOfNextMonth,
  makeCalendarOfPrevMonth,
  makeCalendarOfMonth,
  makeDateObj,
  makeDateObj2,
  adjustMonth,
  makeYYYYMMDD,
  makeDateDisplayStr,
  makeTimeDisplayStr,
  yyyymmddToDateObj,
  makeDateTime, makeDateTime2,
  dateToUnixtimestamp,
  adjustDisplayTimeForMongoDB,
  adjustRegisterTimeForMongoDB,
  changeYearOfDate,
  getYear,
  calculatePeriod,
  getJapaneseImperialYear,
  makeDateCalendar,
  calculateAge
}

const DATE_NAMES = ['日', '月', '火', '水', '木', '金', '土']

// 指定された年月の1か月分の日付のリストを返す
function makeCalendarOfThisMonth () {
  let now = moment()
  let thisYear = now.year()
  let thisMonth = now.month()
  let dates = makeCalendarOfMonth(thisYear, thisMonth)
  return dates
}

function makeCalendarOfPrevMonth (year, month) {
  if (month === 0) {
    year--
    month = 11
  } else {
    month--
  }
  let dates = makeCalendarOfMonth(year, month)
  return dates
}

function makeCalendarOfNextMonth (year, month) {
  if (month === 11) {
    year++
    month = 0
  } else {
    month++
  }
  let dates = makeCalendarOfMonth(year, month)
  return dates
}

function makeCalendarOfMonth (year, month) {
  let dayOfMonth = moment([year, month])
  let daysInMonth = dayOfMonth.daysInMonth()
  let dates = []
  for (let i = 0; i < daysInMonth; i++) {
    let dateObj = makeDateObj(dayOfMonth)
    dates.push(dateObj)
    dayOfMonth.add(1, 'days')
  }
  return dates
}

function makeDateObj (date) {
  let dateObj = {
    timestamp: date.valueOf(),
    year: date.year(),
    month: date.month(),
    date: date.date(),
    dayStr: DATE_NAMES[date.day()]
  }
  return dateObj
}

function makeDateObj2 (date) {
  date = moment(date)
  let dateObj = {
    timestamp: date.valueOf(),
    year: date.year(),
    month: date.month(),
    date: date.date(),
    dayStr: DATE_NAMES[date.day()]
  }
  return dateObj
}

// 一ヶ月分たす
function adjustMonth (date) {
  date = moment(date).add(1, 'month')
  return date
}

function makeYYYYMMDD (timestamp) {
  let date = moment(timestamp)
  let year = date.year()
  let month = date.month() + 1
  let day = date.date()
  let result = year * 10000 + month * 100 + day
  return result.toString()
}

function makeDateDisplayStr (timestamp) {
  let result = moment(timestamp).format('YYYY年MM月DD日')
  return result
}

function makeTimeDisplayStr (timestamp) { // TODO 00:00を登録した時おかしくなる
  let date = moment(timestamp)
  let hour = date.hours()
  let min = date.minutes()
  let timeNum = hour * 100 + min
  let str = moment(timeNum, 'hmm').format('HH:mm')
  return str
}

function makeDateCalendar (timestamp) {
  let result = moment(timestamp).format('YYYY-MM-DD')
  return result
}

function yyyymmddToDateObj (yyyymmdd) {
  let year = yyyymmdd.substring(0, 4)
  let month = yyyymmdd.substring(4, 6) - 1
  let day = yyyymmdd.substring(6, 8)
  let dateObj = makeDateObj(moment([year, month, day]))
  return dateObj
}

function makeDateTime (date, time) {
  date = moment(date)
  time = moment(time)
  let year = date.year()
  let month = date.month()
  let day = date.date()
  let hour = time.hours()
  let min = time.minutes()
  let dateTime = moment([year, month, day, hour, min])
  return dateTime
}

function makeDateTime2 (date) {
  date = moment(date)
  // time = moment(time)
  let year = date.year()
  let month = date.month()
  let day = date.date()
  let hour = date.hours()
  let min = date.minutes()
  let dateTime = moment([year, month, day, hour, min])
  return dateTime
}

function dateToUnixtimestamp (date) {
  date = moment(date)
  let timestamp = date.unix()
  return timestamp
}

function changeYearOfDate (year, oldTimestamp) {
  let oldDate = new Date(oldTimestamp)
  oldDate.setFullYear(year)
  let timestamp = oldDate.valueOf()
  return timestamp
}

function getYear (timestamp) {
  let date = new Date(timestamp)
  let year = date.getFullYear()
  return year
}

// 差分算出－月
function calculatePeriod (fromYear, fromMonth, toYear, toMonth) {
  let fromYMD = moment(makeDateCalendar(fromYear + fromMonth + '01'))
  let toYMD = moment(makeDateCalendar(toYear + toMonth + '01'))
  return toYMD.diff(fromYMD, 'months')
}

// 年齢を計算
function calculateAge (date) {
  const paddingZero = (num, digit) => ('0000' + num).slice(-1 * digit)

  date = new Date(date)
  let year = paddingZero(date.getFullYear(), 4)
  let month = paddingZero(date.getMonth() + 1, 2)
  let day = paddingZero(date.getDate(), 2)

  // 今日の日付
  let today = new Date()
  let todayYear = paddingZero(today.getFullYear(), 4)
  let todayMonth = paddingZero(today.getMonth() + 1, 2)
  let todayDay = paddingZero(today.getDate(), 2)

  return Math.floor((Number(todayYear + todayMonth + todayDay) - Number(year + month + day)) / 10000)
}

function getJapaneseImperialYear (year) {
  let yearObj = {
    longName: '西暦',
    shortName: '西',
    alphaName: 'AD',
    year: year
  }
  // 明治以降の和暦を取得する
  if (year > 1988) {
    // 1989年以降は平成
    yearObj = {
      longName: '平成',
      shortName: '平',
      alphaName: 'H',
      year: year - 1988
    }
  } else if (year > 1925) {
    // 1926年以降は昭和
    yearObj = {
      longName: '昭和',
      shortName: '昭',
      alphaName: 'S',
      year: year - 1925
    }
  } else if (year > 1911) {
    // 1912年以降は大正
    yearObj = {
      longName: '大正',
      shortName: '大',
      alphaName: 'T',
      year: year - 1911
    }
  } else if (year > 1867) {
    // 1868年以降は明治
    yearObj = {
      longName: '明治',
      shortName: '明',
      alphaName: 'M',
      year: year - 1867
    }
  }
  return yearObj
}

// MongoDBから取得した時刻には時差が発生しているため、調整
function adjustDisplayTimeForMongoDB (timestamp) {
  let date = moment(timestamp).add(-9, 'hour')
  return date.valueOf()
}

// MongoDBから取得した時刻には時差が発生しているため、調整
function adjustRegisterTimeForMongoDB (timestamp) {
  let date = moment(timestamp).add(-9, 'hour')
  return date
}
