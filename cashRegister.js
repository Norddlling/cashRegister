function checkCashRegister(price, cash, cid) {
  let rest = cash - price;
  const cashStat = {status: "", change: []};
  const cidWithCurrency = cid.slice(0).reverse();
  let checkBill = [];
  let totalCashInDrawer = 0;
  for (let value of cid) {
    totalCashInDrawer = (totalCashInDrawer * 100 + Number(value[1]) * 100) / 100;
  }
  if (totalCashInDrawer < rest) {
    cashStat.status = "INSUFFICIENT_FUNDS";
    cashStat.change = [];
    return cashStat;
  } else if (totalCashInDrawer >= rest) {
    //Convert currency unit
    for (let elem of cidWithCurrency) {
      let currencyUnit = elem[0];
      let amount = elem[1];
      let currencyDigit = 0;
      switch(currencyUnit) {
        case "PENNY":
          elem.push(0.01);
          break;
        case "NICKEL":
          elem.push(0.05);
          break;
        case "DIME":
          elem.push(0.1);
          break;
        case "QUARTER":
          elem.push(0.25);
          break;
        case "ONE":
          elem.push(1);
          break;
        case "FIVE":
          elem.push(5);
          break;
        case "TEN":
          elem.push(10);
          break;
        case "TWENTY":
          elem.push(20);
          break;
        case "ONE HUNDRED":
          elem.push(100);
          break;
      }
      currencyDigit = elem[2];
      checkBill = cidWithCurrency.filter(elem => elem[1] >= rest && elem[2] <= rest);
      //Check is it enough currency unit in drawer to give the rest
      if (rest%currencyDigit === 0 && amount >= rest) {
        cashStat.status = "OPEN";
        cashStat.change.push([currencyUnit, rest]);
        return cashStat;
      } else if (rest >= amount) {
        rest = (rest * 100 - amount * 100) / 100;
        cashStat.change.push([currencyUnit, amount]);
      } else if (rest < amount && rest > currencyDigit) {
        let divider = Math.floor((rest * 100) / (elem[2] * 100));
        let currency = (currencyDigit * 100 * divider) / 100;
        rest = ((rest * 1000) - (currency * 1000)) / 1000;
        cashStat.change.push([currencyUnit, currency]);
      } 
    } 
  } 
  if (rest === 0) {
    for(let elem of cid) {
      elem.pop(elem[2]);
    }
    cashStat.status = "CLOSED";
    cashStat.change = cid;
    return cashStat;
  }
  //Check if we have spesific type of currecy to give the rest
  if (checkBill.length == 0) {
    cashStat.status = "INSUFFICIENT_FUNDS";
    cashStat.change = [];
    return cashStat;
  }
  return cashStat;
}

checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]);
