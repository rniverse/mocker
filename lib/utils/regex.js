/* eslint-disable no-useless-escape */
const regex = {
  get person_name() {
    return new RegExp('^[A-Za-z][A-Za-z ]{2,127}$', 'i');
  },
  get title() {
    return new RegExp('^[A-Za-z0-9][A-Za-z0-9 ]{2,250}$', 'i');
  },
  get email() {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  },
  get handler() {
    return new RegExp('^[a-z][a-z0-9]{1,512}$');
  },
  get password() {
    return new RegExp('^(?=.[a-zA-Z0-9!@#\$%\^&\*])(?=.{8,})');
  },
  get strong_password() {
    return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  },
  get date() {
    return /^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/;
  },
  get uuid() {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  },
  get mobilenumber() {
    return /^(\+?\d{1,4}[\s-])?(?!0+\s+,?$)\d{10}\s*,?$/;
  }
};

module.exports = regex;
