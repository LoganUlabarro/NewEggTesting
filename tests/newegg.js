var pageObject = {}
var test = require('../testAssets/eggFieldArray')

var generateRandom = () => {
    return Math.floor((Math.random() * 20) + 1)
}
//variables for PC builder
let a; let b; let c; let d; let e; let f; let i; let j;

module.exports = {
    beforeEach: browser => {
        pageObject = browser.page.eggPage()
        pageObject.navigate()
            .maximizeWindow()
    },
    after: browser => {
        pageObject.end()
    },

    'forLoop Computer System Buttons': browser => {
        pageObject
        //About 90% of the time there will be a popup on this website
        //This part of the code will close it
            .initPage(10000)
        //This will test all of the buttons in the Computer System tab
        //and check if they lead to a location of the same name
        for (let i = 0; i < test.length; i++) {
            pageObject
            //if test[i].arrow is empty, then there is no dropout menu to be hovered over
            if (test[i].arrow === 'empty') {
                pageObject
                    .pause(500)
                    .useCss()
                    .click('@menu')
                    //In general, this website is laggy and often breaks without the extra pause
                    .waitForElementVisible('@computerSystem')
                    .moveToElement('@computerSystem', 10, 10)
                    .useXpath()
                    .waitForElementVisible(test[i].selector)
                    .click(test[i].selector)
                    .waitForElementVisible('@pageText')
                    .verify.containsText('@pageText', test[i].section)
                    .useCss()
                    .click('@home')
                    .waitForElementVisible('@menu')
                    .pause(500)
                    .expect.element('@pageText').to.not.be.present
            }
            //If it is not 'empty' then there is a dropout menu that needs to be hovered over
            else if (test[i].arrow !== 'empty'){
                pageObject
                    .pause(500)
                    .click('@menu')
                    .waitForElementVisible('@computerSystem')
                    .moveToElement('@computerSystem', 10, 10)
                    .pause(500)
                    .useXpath()
                    .moveToElement(test[i].arrow, 10, 10)
                    .pause(500)
                    .click(test[i].selector)
                    .waitForElementVisible('@pageText')
                    .verify.containsText('@pageText', test[i].section)
                    .useCss()
                    .click('@home')
                    .waitForElementVisible('@menu')
                    .pause(500)
                    .expect.element('@pageText').to.not.be.present
            }
        }
    },
    
    'Search and check results': browser => {
        searches = ['SSD', 'Monitor', 'Mouse', 'Backpack']
        pageObject
            //About 90% of the time there will be a popup on this website
            //This part of the code will close it
            .initPage(5000)
            //check all searches in the above array
            searches.forEach(searchItem => {
                pageObject
                .searchFor(searchItem)
                .checkResults(searchItem)
                .click('@home')
            })
   },

    'add to cart and verify': browser => {
        let searches = [
            //Capitolize the item my friend
            //max qty depends on the item
            { item: 'Keyboard', qty: 3 },
            { item: 'Mouse', qty: 1 },
            { item: 'Webcam', qty: 2}
            //feel free to add more
        ]
        let total = 0

        pageObject
            .initPage(5000)
        searches.forEach(search => {
            pageObject
                .searchFor(search.item)
                .useXpath()
                //add qty copies of the first item to the cart
                .pause(2000)
                .isVisible({ selector: '@featuredOffers', suppressNotFoundErrors: true }, function (results) {
                var visible = results.value
                if (visible === true){
                    pageObject
                        .waitForElementVisible(`((//a[@class="item-title"])[5])`)
                        .click(`((//a[@class="item-title"])[5])`)
                        .waitForElementVisible('@itemName')
                        .pause(200)
                        .verify.containsText('@itemName', search.item)
                        //change the quantity to the test quantity
                        .waitForElementVisible('@qtyField')
                        .click('@qtyField')
                        .clearValue('@qtyField')
                        .setValue('@qtyField', search.qty)
                    }
                else if (visible !== true){
                    pageObject
                        .waitForElementVisible(`((//a[@class="item-title"])[1])`)
                        .click(`((//a[@class="item-title"])[1])`)
                        .waitForElementVisible('@itemName')
                        .pause(200)
                        .verify.containsText('@itemName', search.item)
                        //change the quantity to the test quantity
                        .waitForElementVisible('@qtyField')
                        .click('@qtyField')
                        .clearValue('@qtyField')
                        .setValue('@qtyField', search.qty)
                    }
                })
                //old metric for if the featured field existed
                //.waitForElementPresent('@featuredOffers', 10000, false)
                total += search.qty;
            pageObject
                //add to cart
                .addToCart(total)
            pageObject
                //return home
                .click('@home')
                .waitForElementVisible('@searchBox')
        })
        //clear cart here
    pageObject
        .waitForElementVisible('@goToCart')
        .click('@goToCart')
        .waitForElementVisible('@removeOrder')
        searches.forEach(number => {
            pageObject
                .click('@removeOrder')
                .pause(4000)
        });
    pageObject
        .verify.containsText('@cartQty', '0')

    },
    //*/
   //This is where we create the random numbers for the next test
    setUpRandomNumbersForPCBuilder: async (browser) => {
        
        a = (await generateRandom())
        b = (await generateRandom())
        c = (await generateRandom())
        d = (await generateRandom())
        e = (await generateRandom())
        f = (await generateRandom())
        i = (await generateRandom())
        j = (await generateRandom())
    },
    
    //using the pc builder we will select random options to create a pc
    'Build a Random PC': browser => {
        //generate 2 random values between 1 and 2 (for the two buttons)
        //these are used for the storage and cooling sections of the code
        var g = Math.floor((Math.random() * 2) + 1)
        var h = Math.floor((Math.random() * 2) + 1)
        pageObject    
            .initPage(5000)
            .useXpath()
            .click('@pcBuilderBtn')
            .waitForElementVisible('@cpuInitBtn')
            //cpu
            .selectPart('@cpuInitBtn', a, 'CPU')
            //motherboard, special case, so no custom command
            .click('@motherboardBtn')
            .waitForElementPresent('@pageText')
            //The text will either say AMD or INTEL based on the CPU we picked
            //This will confirm it is one of the two pages that we go to and log which one it is
            .getText('@pageText', function name(result) {
                console.log(result.value)
                if (result.value === 'INTEL') {
                    pageObject
                        .verify.ok(result.value === 'INTEL', 'INTEL')
                }
                else if(result.value === 'AMD') {
                    pageObject
                        .verify.ok(result.value === 'AMD', 'AMD')
                }
                else {
                    console.log('we done goofed in motherboard')
                }
            })
            .waitForElementPresent(`(//button[@class="btn btn-mini btn-primary"])[${b}]`)
            .click(`(//button[@class="btn btn-mini btn-primary"])[${b}]`)
            .waitForElementVisible('@summary')
            //memory
            .selectPart('@memoryBtn', c, 'MEMORY')
            //Video card
            .selectPart('@videoCardBtn', d, 'VIDEO CARD')
            //case
            .selectPart('@caseBtn', e, 'CASE')
            //PowerSupply
            .selectPart('@powerSupplyBtn', f, 'POWER SUPPLY')
            //storage
            .click('@storageBtn')
            //click hard drive or ssd. g should be 1 or 2 (left or right button)
            .click(`(//a[@class="pc-builder-icon"])[${g}]`)
            .getText('@pageText', function name(result) {
                if (result.value === 'HARD DRIVE') {
                    pageObject
                        .verify.ok(result.value === 'HARD DRIVE', 'HARD DRIVE')
                }
                else if (result.value === 'SSD') {
                    pageObject
                        .verify.ok(result.value === 'SSD', 'SSD')
                }
                else {
                    console.log('we done goofed in storage')
                }
            })
            .waitForElementPresent(`(//button[@class="btn btn-mini btn-primary"])[${i}]`)
            .pause(500)
            .click(`(//button[@class="btn btn-mini btn-primary"])[${i}]`)
            .waitForElementVisible('@summary')
            //Fan, heat sinks or water cooled, h is 1 or 2 (left or right button)
            .click('@fanBtn')
            .click(`(//a[@class="pc-builder-icon"])[${h}]`)
            .getText('@pageText', function name(result) {
                if (result.value === 'FAN & HEATSINK') {
                    pageObject
                        .verify.ok(result.value === 'FAN & HEATSINK', 'FAN & HEATSINK')
                }
                else if (result.value === 'WATER COOLER KIT') {
                    pageObject
                        .verify.ok(result.value === 'WATER COOLER KIT', 'WATER COOLER KIT')
                }
                else {
                    console.log('we done goofed in the fridge')
                }
            })
            .waitForElementPresent(`(//button[@class="btn btn-mini btn-primary"])[${j}]`)
            .pause(500)
            .click(`(//button[@class="btn btn-mini btn-primary"])[${j}]`)
            .waitForElementVisible('@summary')
            //Operating System, just pick the top windows button
            .click('@osBtn')
            .waitForElementVisible(`(//button[@class="btn btn-mini btn-primary"])[${1}]`)
            .verify.containsText('@pageText', 'OPERATING SYSTEM')
            .click(`(//button[@class="btn btn-mini btn-primary"])[${1}]`)
            .waitForElementVisible('@summary')
            //go to the cart
            .click('@addAllToCart')
            //verify 9 or 10 items in cart
            .waitForElementVisible('@cartQty')
            .getText('@cartQty', function name(result) {
                if (result.value === '(9 Items)') {
                    pageObject
                        .verify.ok(result.value === '(9 Items)', '9 items in the cart')
                }
                else if (result.value === '(10 Items)') {
                    pageObject
                        .verify.ok(result.value === '(10 Items)', '10 items in cart')
                }
                else {
                    console.log('The cart is messed up, ' + result.value + ' in cart')
                }
            })
    }
}