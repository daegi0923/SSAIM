const calculateWeeks = (start: Date, end: Date): Array<{ startDate: Date; endDate: Date }> => {
  const weeks = [];
  const currentStart = new Date(start);

  // 시작일 조정: 금요일로 설정
  if (currentStart.getDay() >= 1 && currentStart.getDay() <= 4) {
    currentStart.setDate(currentStart.getDate() - (currentStart.getDay() + 2));
  } else if (currentStart.getDay() === 6) {
    currentStart.setDate(currentStart.getDate() - 1);
  } else if (currentStart.getDay() === 0) {
    currentStart.setDate(currentStart.getDate() - 2);
  }

  while (currentStart <= end) {
    console.log(currentStart)
    const weekEnd = new Date(currentStart);
    weekEnd.setDate(currentStart.getDate() + 6);

    // 마지막 주 조정
    weeks.push({
      startDate: new Date(currentStart),
      endDate: new Date(weekEnd),
    });

    currentStart.setDate(currentStart.getDate() + 7);
  }

  // 마지막 주 확인
  const lastWeek = weeks[weeks.length - 1];
  if (lastWeek.endDate < end) {
    weeks[weeks.length - 1].endDate = new Date(end);
  }
  console.log(weeks)
  return weeks;
};

export default calculateWeeks