export const dateToString = (date: Date | string | null | undefined, parser = '.') => {
  if (!date) {
    return null;
  }
  if (typeof date === 'string') {
    date = new Date(date); // 문자열일 경우 Date 객체로 변환
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 두 자리로 변환
  const day = date.getDate().toString().padStart(2, '0'); // 두 자리로 변환
  return `${year}${parser}${month}${parser}${day}`;
};
