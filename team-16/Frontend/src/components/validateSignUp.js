export default function validateSignUp(email) {
  let errors = {};

  //email
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!email) {
    errors.email = "Email is required!";
  } else if (!regex.test(email)) {
    errors.email = "Please enter a valid email address...";
  }
  return errors;
}
