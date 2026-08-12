import moment from "moment";

export const dateFormatter = (date: string) => {
  return moment(date).locale("id").format("D MMMM YYYY HH:mm");
};
