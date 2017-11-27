function f() {
    try {
        throw 1;
    } catch (e) {
        return;
    }
    console.log('1231');
}