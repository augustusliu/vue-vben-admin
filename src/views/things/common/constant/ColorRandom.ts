const TAG_BG_COLOR: string[] = [
  'cyan',
  'magenta',
  'geekblue',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'blue',
  'purple',
];

export const randomColor = () => {
  let ran =Math.floor(Math.random() * (TAG_BG_COLOR.length - 1 + 1));
  return TAG_BG_COLOR[ran];
}

export const indexColor = (index) => {
  return TAG_BG_COLOR[index];
}
