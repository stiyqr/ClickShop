function isEmpty(value) {
    return !value || value.trim() === '';
}

function userCredentialsAreValid(username, password) {
    return (
        username && username.trim().length >= 4 && password && password.trim().length >= 4
    );
}

function userDetailsAreValid(username, password, phone) {
    return (
        userCredentialsAreValid(username, password) &&
        !isEmpty(phone)
    );
}

function passwordIsConfirmed(password, confirmPassword) {
    return password === confirmPassword;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    passwordIsConfirmed: passwordIsConfirmed,
};
