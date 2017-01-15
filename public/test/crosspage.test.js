var Browser = require('zombie')
var assert = require('chai').assert
var browser
suite('Cross-page tests', () => {
    setup(() => {
        browser = new Browser()
    })
    test('request about page from home page', () => {
        var referrer = 'http://localhost:3000'
        browser.visit(referrer, () => {
            //自动化点击链接的操作，断言referrer是否正确
            browser.clickLink('.about', () => {
                //这个断言有问题
                assert(browser.field('referrer').value === referrer)
                done();
            })
        })

    })

})
