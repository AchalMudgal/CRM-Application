exports.userResponse = (users) => {


    userResult = [];

    users.forEach(user => {
        userResult.push({
            name : user.name,
            userid : user.userId,
            email: user.email,
            userTypes : user.userTypes,
            userStatus : user.userStatus
        })
    });
    return userResult;
}