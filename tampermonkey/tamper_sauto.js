// ==UserScript==
// @name         Copy cars to clipboard
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        file:///home/ds661309/Downloads/sauto.html
// @match        https://www.sauto.cz/inzerce/osobni/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_download
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at       document-idle
// ==/UserScript==

var cars = [];

function extractAllFields(eachOrder) {

    let nameField=$(eachOrder).find(".c-item__name:first").text().replace(/\s\s+/g, ' ');
    let infoField=$(eachOrder).find(".c-item__info").text().replace(/\s\s+/g, ' ');
    let locality=$(eachOrder).find(".c-item__locality").text().replace(/\s\s+/g, ' ');
    let price=$(eachOrder).find(".c-item__price").text().replace(/Kč/g, '').replace(/\s+/g, '');
    let link=$(eachOrder).find(".c-item__link").attr('href');
    let seller=$(eachOrder).find(".c-item__seller").text().replace(/\s\s+/g, ' ');
    

    let [year, km, fuel, gearbox] = infoField.split(',')
    km=km.replace(/km/g, '').replace(/\s+/g, '')
    // Get all params available to car
    let car = {
        x: Math.round(parseInt(km, 10)/1000), //km
        y: Math.round(parseInt(price, 10)/1000), //price
        z: 2021-parseInt(year), //year
        name: nameField,
        fuel: fuel.replace(/\s+/g, ''),
        gearbox: gearbox.replace(/\s+/g, ''),
        locality: locality.replace(/\s+/g, ''),
        link: link,
        seller: seller
    }

    cars.push(car);
}

var elements = $(".c-item-list__list .c-item__data-wrap")

$(elements).each((index, eachOrder) => extractAllFields(eachOrder));

console.log("ready!");

GM_setClipboard(JSON.stringify(cars));
