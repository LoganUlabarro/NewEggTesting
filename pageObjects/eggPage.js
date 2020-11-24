var customCommands = {
    //searches for 'search' then checks the result text for what you searched for
    //Input this in all caps, because newegg is rude and uses all caps
    searchFor: function (search) {
        this
            .clearValue('@searchBox')
            .setValue('@searchBox', [search, this.api.Keys.ENTER])
        this
            .waitForElementVisible('@pageText')
            .verify.containsText('@pageText', search.toUpperCase())

        return this
    },
    //this will get rid of that annoying popup
    //default time is 10000 (10 seconds)
    initPage: function (time) {
        this
            .pause(time)    
            .isVisible({ selector: '#popup-close', suppressNotFoundErrors: true }, function (results) {
                var visible = results.value
                if (visible === true) {
                    this
                        .click('#popup-close')
                }
                else{}
            })
            .click('@darkMode')
        return this
    },
    pcNextPage: function(time) {
        this
            .pause(time)
            .isVisible({ selector: '@annoyingBtn', suppressNotFoundErrors: true }, function (results) {
                var visible = results.value
                if (visible === true) {
                    this
                        .useXpath()
                        .click('(//button[@class="btn btn-mini btn-secondary"])[2]')
                        .useCss()
                }
                else {
                    this
                        .useXpath()
                        .click('(//button[@class="btn btn-mini btn-secondary"])[1]')
                        .useCss()
                }
            })
        return this
    },

    //run this command after .searchFor, checks the first x results
    //to see if they contain the 'search' word
    checkResults: function (search) {
        this
            //the results selectors are indexed 5 through 7
            //the other results are on a side bar lookin' like adverts
            for (let i = 5; i < 8; i++){
            this
                var self = this
                .pause(2000)
                .isVisible({ selector: '@featuredOffers', suppressNotFoundErrors: true }, function (results) {
                    var visible = results.value
                    if (visible === true) {
                        self
                            .useXpath()
                            .waitForElementVisible(`((//a[@class="item-title"])[${i}])`)
                            .click(`((//a[@class="item-title"])[${i}])`)
                            .useCss()
                            .waitForElementVisible('@itemName')
                            //.waitForElementVisible('.product-title')
                            .pause(200)
                            .verify.containsText('@itemName', search)
                            this.back()
                    }
                    //This means that the annoying suggestions section isn't present on the page
                    //So we can just select the first item on the list
                    else{
                        self
                            .useXpath()
                            .waitForElementVisible(`((//a[@class="item-title"])[${i-4}])`)
                            .click(`((//a[@class="item-title"])[${i-4}])`)
                            .useCss()
                            .waitForElementVisible('@itemName')
                            //.waitForElementVisible('.product-title')
                            .pause(200)
                            .verify.containsText('@itemName', search)
                            this.back()
                    }
                })
            }
            this
            return this
    },
    addToCart: function (total) {
        this
            .click('@addToCart')
            .waitForElementVisible('@noWarranty')
            .click('@noWarranty')
            .waitForElementVisible('@continueShopBtn')
            .click('@continueShopBtn')
            //check cart
            .waitForElementVisible('@goToCart')
            .click('@goToCart')
            .waitForElementVisible('@cartQty')
            .verify.containsText('@cartQty', total)
    },
    selectPart: function (selectorBtn, rand, MyTEXT){
        this
            //selectorBtn in quotations, for example '@memoryBtn'
            .click(selectorBtn)
            .useXpath()
            .waitForElementPresent('@pageText')
            //MyTEXT is in all caps, in ''
            .verify.containsText('@pageText', MyTEXT)
            .waitForElementPresent(`(//button[@class="btn btn-mini btn-primary"])[${rand}]`)
            .click(`(//button[@class="btn btn-mini btn-primary"])[${rand}]`)
            .waitForElementVisible('@summary')
        return this
    }
}

module.exports = {
    url: 'https://www.newegg.com/',
    commands: [customCommands],
    elements: {
        //main functionality
        menu: 'i[class="fas fa-bars"]',
        home: 'img[alt="Newegg"]',
        darkMode: 'div[class="form-toggle form-toggle-primary dark-mode-toggle"]',
        pageText: '.page-title-text',
        //all the menu item selectors
        computerSystem: {
            selector: '(//a[@class="nav-list-link"])[1]',
            locateStrategy: 'xpath'
        },
        dropOut2: {
            selector: '(//a[@class="nav-list-link menu-box-trigger"])[1]',
            locateStrategy: 'xpath'
        },
        result1: {
            selector: '((//a[@class="item-title"])[5])',
            locateStrategy: 'xpath'
        },
        homeAdd: 'img[title = "Black Friday New Deals Added"]',
        //this selector is totally different when not in automation
        searchBox: 'input[type = "search"]',
        itemName: '.product-title',
        featuredOffers: '.secondary-box-title',
        //Checkout Selectors
        qtyField: '.qty-box-input',
        addToCart: '.btn-wide',
        noWarranty: 'button[data-dismiss="modal"]',
        continueShopBtn: 'button[title="Continue Shopping"]',
        goToCart: '.fa-shopping-cart',
        cartQty: '.row-title-note',
        removeOrder: {
            selector: '(//button[@class="btn btn-mini btn-tertiary"])[3]',
            locateStrategy: 'xpath'
        },
        //pc builder
        pcBuilderBtn: 'a[title="PC Builder"]',

        //To start building your own pc
        cpuInitBtn: '.diy-cpu',
        //mother board needs to know Intel or AMD
        motherboardBtn: {
            selector: '(//i[@class="diy-motherboard"])[2]',
            locateStrategy: 'xpath'
        }, 
        memoryBtn: {
            selector: '(//i[@class="diy-memory"])[2]',
            locateStrategy: 'xpath'
        }, 
        videoCardBtn: {
            selector: '(//i[@class="diy-gpu"])[2]',
            locateStrategy: 'xpath'
        }, 
        caseBtn: {
            selector: '(//i[@class="diy-case"])[2]',
            locateStrategy: 'xpath'
        }, 
        powerSupplyBtn: {
            selector: '(//i[@class="diy-psu"])[2]',
            locateStrategy: 'xpath'
        }, 
        //storage needs SSD or Hard Drive
        storageBtn: {
            selector: '(//i[@class="diy-hdd"])[2]',
            locateStrategy: 'xpath'
        },
        leftBtn: {
            selector: '(//a[@class="pc-builder-icon"])[1]',
            locateStrategy: 'xpath'
        },
        rightBtn: {
            selector: '(//a[@class="pc-builder-icon"])[2]',
            locateStrategy: 'xpath'
        },
        //fan needs heatsinks or water cooler
        fanBtn: {
            selector: '(//i[@class="diy-cooling"])[2]',
            locateStrategy: 'xpath'
        },
        osBtn: {
            selector: '(//i[@class="diy-os"])[2]',
            locateStrategy: 'xpath'
        },
        //The 1 index is add new list, this should always click the lowest down select button
        selectNext: {
            selector: '(//button[@class="btn btn-mini btn-secondary"])[1]',
            locateStrategy: 'xpath'
        },
        selectNextAlt: {
            selector: '(//button[@class="btn btn-mini btn-secondary"])[2]',
            locateStrategy: 'xpath'
        },
        annoyingBtn: {
            selector: '//button[text()="Add New List"]',
            locateStrategy: 'xpath'
        },
        //May not use this here, might need it to be in the code propper to update the index
        selectBtn: {
            selector: '(//button[@class="btn btn-mini btn-primary"])',
            locateStrategy: 'xpath'
        },
        addAllToCart: {
            selector: '//button[@class="btn btn-undefined btn-primary"]',
            locateStrategy: 'xpath'
        },
        summary: '.pc-builder-summary'


    }
}