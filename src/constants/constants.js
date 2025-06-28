// import { ToWords } from 'to-words';


const userAddress1 = localStorage.getItem("userAddress");
const userAddress = JSON.parse(userAddress1);

export const AppConstants = {
  Api_BaseUrl: "http://api.jyotishee.com/api/"
}


export const monthsArr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const formatDate = (newDate) => {
  const months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  }
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const d = newDate
  const year = d.getFullYear()
  const date = d.getDate()
  const monthIndex = d.getMonth()
  const monthName = months[d.getMonth()]
  const dayName = days[d.getDay()] // Thu
  const formatted = ` ${date} ${monthName}, ${year}`
  let finalDate = formatted.toString()
  // console.log(isNaN(monthIndex), "finalDate");
  if (isNaN(monthIndex) === true) {
    finalDate = "N/A"
  }

  return finalDate
}

// ===number to word converter ==========
// export const toWords = new ToWords({
//   localeCode: `en-IN`,
//   converterOptions: {
//     currency: true,
//     ignoreDecimal: false,
//     ignoreZeroCurrency: false,
//     doNotAddOnly: false,
//     // currencyOptions: { // can be used to override defaults for the selected locale
//     //   name: 'Rupee',
//     //   plural: 'Rupees',
//     //   symbol: '₹',
//     //   fractionalUnit: {
//     //     name: 'Paisa',
//     //     plural: 'Paise',
//     //     symbol: '',
//     //   },
//     // }
//   }
// });
