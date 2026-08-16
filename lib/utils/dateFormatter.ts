import moment from "moment";

export const dateFormatter = (date: string | Date) => {
  return moment(date).locale("id").format("D MMMM YYYY HH:mm");
};
