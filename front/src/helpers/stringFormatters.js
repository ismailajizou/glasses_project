export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
export const title = str => str.split(" ").map(word => capitalize(word)).join(" ");