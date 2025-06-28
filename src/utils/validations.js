// ============Email validation formate abc@gamail.com===========//
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


// ===============Phone number validation===========//
const deformatPhone = (value) => {
  const onlyNums = `${value}`;
  return onlyNums.replace(/[^\d]/g, "");
};

export const mobileNoFormatter = (value) => {
  if (!value) return value;

  const phoneNumber = deformatPhone(value);

  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;

  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`;
}