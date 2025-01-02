// [
//   "01",
//   "07",
//   "01",
//   "01",
//   "05",
//   "05",
//   "05",
//   "05",
//   "05",
//   "03",
//   "03",
//   "02",
//   "02",
//   "07",
//   "02",
//   "02",
// ];
count = "";
let i = 11;

if (i < 10) {
  let i = "0" + i.toString();
}

const array = [1, 2, 3, 2, 1, 2, 3, 1];
const target = i;

const count = array.filter((element) => element === target).length;
if (count > 0) {
  let result = count;
}
