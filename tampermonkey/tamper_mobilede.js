// ==UserScript==
// @name         Copy cars to clipboard (MobileDE)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://suchen.mobile.de/fahrzeuge/search.html*
// @icon         https://www.google.com/s2/favicons?domain=mobile.de
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_download
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at       document-idle
// ==/UserScript==

var cars = [];

function extractAllFields(eachOrder) {

    let nameField=$(eachOrder).find(".headline-block").text().replace(/\s\s+/g, ' ')
    let priceField=$(eachOrder).find(".price-block .u-block:first").text().replace(/€|,/g, '')
    let infoField=$(eachOrder).find(".vehicle-data--ad-with-price-rating-label > div:first").text().replace(/\s\s+/g, ' ')
    let otherInfo=$(eachOrder).find(".vehicle-data--ad-with-price-rating-label > div:nth-child(2n)").text().replace(/\s\s+/g, ' ')
    let dealer=$(eachOrder).find(".g-col-10:nth-child(2n)").text().replace(/\s\s+/g, ' ')
    let address=$(eachOrder).find(".g-col-10:nth-child(3n)").text().replace(/\s\s+/g, ' ')
    let linkField=$(eachOrder).find(".link--muted").attr("href")

    // post-production
    let [year, km, power] = infoField.split(',')
    year = year.split(' ')[1].split('/')[1]
    km=km.replace(/km/g, '').replace(/\./g, '').replace(/\s+/g, '')

    let [owner, accidents,fuel,gearbox,techreview,doors] = otherInfo.split(',')
    address=address.split(',')[0]
    fuel=fuel.replace(/\s+/g, '')
    gearbox=gearbox.replace(/\s+/g, '')

    //converting price to CZK - 25,8
    let price=Math.round(parseInt(priceField, 10)*25.8/1000)

    let link=linkField.split('&')[0].split('=')[1]

    // Get all params available to car
    let car = {
        x: Math.round(parseInt(km, 10)/1000), //km
        y: price, //price
        z: 2021-parseInt(year), //year
        name: nameField,
        // fuel: fuel,
        // gearbox: gearbox,
        locality: address,
        link: link,
        // seller: dealer
    }

    cars.push(car);
}

var elements = $(".cBox-body--resultitem")

$(elements).each((index, eachOrder) => extractAllFields(eachOrder));

GM_setClipboard(JSON.stringify(cars));
