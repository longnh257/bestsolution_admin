const getAcessToken = async () => {
    return 'Bearer: ' + window.localStorage.getItem('access_token')
}

export {
    getAcessToken
};