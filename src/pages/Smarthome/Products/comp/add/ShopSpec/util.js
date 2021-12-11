const getTrueArray = tableDataArr => {
  const array = [];
  tableDataArr.forEach(item => {
    if (
      item &&
      item.value &&
      item.value.val &&
      item.value.val.length > 0 &&
      item.value.selectValue &&
      item.value.selectValue !== ''
    ) {
      array.push(item.value);
    }
  });
  return array;
};

export default { getTrueArray };
