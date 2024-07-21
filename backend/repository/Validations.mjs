export class Validations {
  static identificationNumber (identificationNumber) {
    if (typeof identificationNumber !== 'string') throw new Error('The identification number must be string');
    if (identificationNumber.length < 3) throw new Error('The identification number must be more than 3 characters');
  }

  static businessName (businessName) {
    if (typeof businessName !== 'string') throw new Error('The business name must be a string');
    if (businessName.length < 3) throw new Error('The business name must be more than 3 characters');
  }

  static names (names) {
    if (typeof names !== 'string') throw new Error('The names must be a string');
    if (names.length < 3) throw new Error('The names must be more than 3 characters');
  }

  static surnames (surnames) {
    if (typeof surnames !== 'string') throw new Error('The surnames must be a string');
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('The password must be a string');
    if (password.length < 3) throw new Error('The password must be more than 3 characters');
  }
}
