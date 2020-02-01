process.stdin.setEncoding('utf8');

let params = process.argv.splice(2);
let numbers;
let target;

process.stdout.write('请输入初始值（[[number1, number2, number3...]]）:\n');
process.stdin.on("readable", () => {
  let chunk;
  while((chunk = process.stdin.read()) !== null) {
    if (!!chunk.replace(/[\r\n]/g, '')) {
      if (!numbers) {
        numbers = chunk;
        process.stdout.write('请输入目标值（[[number]]）:\n');
      } else {
        target = chunk;
        process.stdin.emit('end');
      }
    } else {
      process.stdout.write('请输入初始值（[[number1, number2, number3...]]）:\n');
    }
  }
});

process.stdin.on('end', () => {
  process.stdout.write(`numbers = ${numbers}, target = ${target}`);
  process.exit();
});
