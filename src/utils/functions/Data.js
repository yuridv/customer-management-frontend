const Data = (options = {}, data = undefined) => {
  const date = data ? new Date(data) : new Date();
  if (!data) date.setHours(date.getHours() - 3);

  if (options.seconds) date.setSeconds(date.getSeconds() + options.seconds);
  if (options.minutes) date.setMinutes(date.getMinutes() + options.minutes);
  if (options.hours) date.setHours(date.getHours() + options.hours);
  if (options.months) date.setMonth(date.getMonth() + options.months);

  if (options.days) {
    if (options.uteis || options.feriados) {
      const adjustedDays = Math.abs(options.days);
      const direction = options.days < 0 ? -1 : 1;
      let remaining = adjustedDays;

      while (remaining > 0) {
        date.setDate(date.getDate() + direction);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const formattedDate = date.toISOString().slice(5, 10); // 'MM-DD'

        if (options.uteis && isWeekend) continue;
        if (options.feriados && feriados.includes(formattedDate)) continue;

        remaining--;
      }
    } else {
      date.setDate(date.getDate() + options.days);
    }
  }

  return date;
};

export default Data;

const feriados = [
  '01-01', // ANO NOVO
  '02-20', // CARNAVAL
  '02-21', // CARNAVAL
  '04-07', // SEXTA SANTA
  '04-21', // TIRADENTES
  '05-01', // DIA DO TRABALHADOR
  '06-08', // CORPUS CHRISTI
  '09-07', // INDEPENDÊNCIA
  '09-20', // FARROUPILHA
  '10-12', // NOSSA SENHORA
  '11-02', // FINADOS
  '11-15', // REPUBLICA
  '12-25'  // NATAL
];