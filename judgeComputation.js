let operationList = [1,2,3,4];
let operations = {
    1: '+',
    2: '-',
    3: '*',
    4: '/'
}

function main (input, target) {
  let { isValidated, message} = validator(input, target);
  if (isValidated) {
    console.log(">>>divide input starting...");
    let groupedInput = divideInput(input);
    console.log(">>>test computation starting...");
    let result = testComputation(groupedInput, target);
    if (result.length) {
      result.map(ele => {
        console.log(ele);
      });
    } else {
      console.log(`cannot get ${target}`);
    }
  } else {
    console.log(message)
    return;
  } 
}
 // validate function
function validator(input, target) {
  if (typeof target !== "number") {  
    return {
      isValidated: false,
      message: "target must be number" 
    };
  }
  if (!Array.isArray(input)) {
    return {
      isValidated: false,
      message: "input must be an array" 
    };
  }
  if (input.length !== 4) {
    return {
      isValidated: false,
      message: "input number must have four elements" 
    };
  }
  for (let i = 0; i < input.length; i++) {
    if (typeof input[i] !== "number") {
      return {
        isValidated: false,
        message: "every input array element must be a number"
      };  
    }
    if (input[i] <= 0) {
      return {
        isValidated: false,
        message: "every input array element must be a positive number"
      };  
    }
  }
  return {
    isValidated: true,
    message: ""
  }
}

// divide input into groups
function divideInput (input) {
  let result = [];
  // 1 + 1 + 2
  result.push([input[0], input[1], [input[2], input[3]]]);
  result.push([input[1], input[0], [input[2], input[3]]]);
  result.push([input[0], input[2], [input[1], input[3]]]);
  result.push([input[2], input[0], [input[1], input[3]]]);
  result.push([input[0], input[3], [input[1], input[2]]]);
  result.push([input[3], input[0], [input[1], input[2]]]);
  result.push([input[1], input[2], [input[0], input[3]]]);
  result.push([input[2], input[1], [input[0], input[3]]]);
  result.push([input[1], input[3], [input[0], input[2]]]);
  result.push([input[3], input[1], [input[0], input[2]]]);
  result.push([input[2], input[3], [input[0], input[1]]]);
  result.push([input[3], input[2], [input[0], input[1]]]);
  // 2 + 2
  result.push([[input[0], input[1]], [input[2], input[3]]]);
  result.push([[input[0], input[2]], [input[1], input[3]]]);
  result.push([[input[0], input[3]], [input[1], input[2]]]);
  return result;
}

function testComputation (groupedInput, target) {
  let outputs = [];
  let result = [];
  groupedInput.map(group => {
    if (group.length === 2) {
      // (a b) (c d);
      let firstResult = basicOperation(group[0][0], group[0][1]);
      let secondResult = basicOperation(group[1][0], group[1][1]);
      outputs = outputs.concat(secondaryOperation(firstResult, secondResult));
    } else if (group.length === 3) {
      // a (b (c d))
      let firstResult = basicOperation(group[2][0], group[2][1]);
      let secondResult = secondaryOperation([group[1]], firstResult);
      outputs = outputs.concat(secondaryOperation([group[0]], secondResult));
    }
  });
  outputs.map(output => {
    if (output.value === target) {
      result.push(`${output.m} ${operations[output.operation]} ${output.n} = ${target}`)
    }
  });
  return result;
} 
function basicOperation (m, n) {
  let result = [];
  operationList.map(operation => {
    switch (operation) {
      case 1:
        result.push({
          m: m,
          n: n,
          value: m + n,
          operation: operation
        });
        break;
      case 2:
        if (m > n) {
          result.push({
            m: m,
            n: n,
            value: m - n,
            operation: operation
          });
        } else {
          result.push({
            m: n,
            n: m,
            value: n - m,
            operation: operation
          });
        } 
        break;
      case 3:
          result.push({
            m: m,
            n: n,
            value: m * n,
            operation: operation
          });
        break;      
      case 4:
          result.push({
            m: m,
            n: n,
            value: m / n,
            operation: operation
          });
          result.push({
            m: n,
            n: m,
            value: n / m,
            operation: operation
          });
        break;
      default:
        null;                      
    }
  });
  return result;
}

function secondaryOperation (left, right) {
  // console.log(left, right);
  let result = [];
  for (let i = 0; i < left.length; i++) {
    for (let j = 0; j < right.length; j++) {
      for (let k = 0; k < operationList.length; k++) {
        switch (operationList[k]) {
          case 1:
            result.push({
              m: left[i].n? `(${left[i].m} ${operations[left[i].operation]} ${left[i].n})` : left[i],
              n: `(${right[j].m} ${operations[right[j].operation]} ${right[j].n})`,
              value: left[i].n? left[i].value + right[j].value : left[i] + right[j].value,
              operation: operationList[k]
            });
            break;
          case 2:
            let realLeftValue = left[i].n? left[i].value : left[i];
            if (realLeftValue > right[j].value) {
              result.push({
                m: left[i].n? `(${left[i].m} ${operations[left[i].operation]} ${left[i].n})` : left[i],
                n: `(${right[j].m} ${operations[right[j].operation]} ${right[j].n})`,
                value: realLeftValue - right[j].value,
                operation: operationList[k]
              });
            } else {
              result.push({
                m: `(${right[j].m} ${operations[right[j].operation]} ${right[j].n})`,
                n: left[i].n? `(${left[i].m} ${operations[left[i].operation]} ${left[i].n})` : left[i],
                value: right[j].value - realLeftValue,
                operation: operationList[k]
              });
            }
            break;
          case 3:
            result.push({
              m: left[i].n? `(${left[i].m} ${operations[left[i].operation]} ${left[i].n})` : left[i],
              n: `(${right[j].m} ${operations[right[j].operation]} ${right[j].n})`,
              value: left[i].n? left[i].value * right[j].value : left[i] * right[j].value,
              operation: operationList[k]
            });
            break;
          case 4:
            if (right[j].value !== 0) {
              result.push({
                m: left[i].n? `(${left[i].m} ${operations[left[i].operation]} ${left[i].n})` : left[i],
                n: `(${right[j].m} ${operations[right[j].operation]} ${right[j].n})`,
                value: left[i].n? left[i].value / right[j].value : left[i] / right[j].value,
                operation: operationList[k]
              });
            }
            if ((left[i].n && left[i].value !== 0) || (typeof left[i] === "number" && left[i] !== 0)) {
              result.push({
                m: `(${right[j].m} ${operations[right[j].operation]} ${right[j].n})`,
                n: left[i].n? `(${left[i].m} ${operations[left[i].operation]} ${left[i].n})` : left[i],
                value: left[i].n? right[j].value / left[i].value : right[j].value / left[i],
                operation: operationList[k]
              });
            }
            break;    
        }
      }
    }
  }
  return result;
}

main([4, 6, 2, 10], 24);
