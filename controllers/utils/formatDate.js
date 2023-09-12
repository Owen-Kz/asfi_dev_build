const formatDate =  (inputDate) =>{
// const inputDate = "2023-08-30 16:39:50";
const dateObject = new Date(inputDate);

const options = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  weekday: 'short',
//   hour: 'numeric',
//   minute: 'numeric',
//   second: 'numeric',
};

const formattedDate = dateObject.toLocaleDateString('en-US', options);
return formattedDate

}
 
module.exports  = formatDate