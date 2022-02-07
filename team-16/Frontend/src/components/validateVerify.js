export default function validateVerify(otp) {
  let errors = {};

  //otp

  if (!otp) {
    errors.otp = "OTP is required!";
  } else if (otp.length !== 6) {
    errors.otp = "OTP is of 6 digits";
  }

  return errors;
}
