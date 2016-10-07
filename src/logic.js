

var logic = {
  convertNumber: function(number) {

    var finalString = "";
    var tempNumber, wholeNumber, tensInteger;

    // calculate and save the decimal portion
    var decimalPortion = (number - Math.floor(number))

    //a proper way to round numbers using exponential notation
    decimalPortion = Number(Math.round(decimalPortion+'e2')+'e-2');

    //convert to integer
    number = parseInt(number)

    //COUNT number of MILLIONS to add
    if (number > 999999) {
      hundredInteger = number / 1000000;
      wholeNumber  = Math.floor(hundredInteger)
      finalString += calculateBelowOneThousand(wholeNumber)
      finalString += " MILLION"

      number = number - (wholeNumber * 1000000);
      finalString += addPadding(number)

      //if less than 100 and we have a leftover we need AND
      if (number < 100 && number != 0) {
        finalString += 'AND '
      }
    }

    //count number of THOUSANDS to add
    if (number > 999) {
      hundredInteger = number / 1000;
      wholeNumber  = Math.floor(hundredInteger)
      finalString += calculateBelowOneThousand(wholeNumber)
      finalString += " THOUSAND"
      number = number - (wholeNumber * 1000);
      finalString += addPadding(number)

      if (number < 100 && number != 0) {
        finalString += 'AND '
      }
    }
    //If there is anything left, simply map it
    if (number > 0) {
      finalString += calculateBelowOneThousand(number)
    }
    finalString += ' DOLLARS'

    //now map the cents portion
    if (decimalPortion != 0) {
      finalString += ' AND '
      finalString += calculateBelowOneThousand(decimalPortion * 100);
      finalString += ' CENTS'
    }
    return finalString;
  }
}

//add padding if we still have numbers remaining
function addPadding(number) {
    return (number > 0) ? ' ' : '';
}

function calculateBelowOneThousand(number) {
  var finalString = "";

  if (number > 99) {
    var wholeNumber  = Math.floor(number / 100)
    //Get the number of HUNDREDS and translate that into a word
    finalString += lookupOneHundred(wholeNumber)
    finalString += " HUNDRED"

    //Subtract the number of hundreds to leave a remainder.
    number = number - (wholeNumber * 100);
    if (number > 0) {
      finalString += ' AND '
    }
  }

  if (number > 20) {
    //Anything above 20 could require 2 words. So get the first word. If it ends //in 0 then there will be only one word. Like THIRTY
    var wholeNumber  = Math.floor(number / 10)
    finalString += lookupOneHundred(wholeNumber * 10)
    number = number - (wholeNumber * 10)
    finalString += addPadding(number)
  }

  if (number > 0) {
    finalString += lookupOneHundred(number)
  }
  return finalString;
}


function lookupOneHundred(number) {
  switch (number) {
    case 1: return "ONE";
    case 2: return "TWO";
    case 3: return "THREE";
    case 4: return "FOUR";
    case 5: return "FIVE";
    case 6: return "SIX";
    case 7: return "SEVEN";
    case 8: return "EIGHT";
    case 9: return "NINE";
    case 10: return "TEN";
    case 11: return "ELEVEN";
    case 12: return "TWELVE";
    case 13: return "THIRTEEN";
    case 14: return "FOURTEEN";
    case 15: return "FIFTEEN";
    case 16: return "SIXTEEN";
    case 17: return "SEVENTEEN";
    case 18: return "EIGHTEEN";
    case 19: return "NINETEEN";
    case 20: return "TWENTY";
    case 30: return "THIRTY";
    case 40: return "FORTY";
    case 50: return "FIFTY";
    case 60: return "SIXTY";
    case 70: return "SEVENTY";
    case 80: return "EIGHTY";
    case 90: return "NINETY";
  }
}
module.exports = logic;
