/**
 * Creates an invoice of an order
 */

import { Order } from "./Order.js"

export class Invoice {
    /**
     * @type {Order} The order to create an invoice from
     */
    #order

    /**
     * @type {String} The name of the customer
     */
    #customerName

    /**
     * @type {String} The date when the invoice was created
     */
    #date


    /**
     * The constructor
     *
     * @param {Order} order The order to create an invoice from
     */
    constructor(order, name) {
        this.setOrder(order)
        this.setName(name)
        this.#date = new Date().toLocaleString("sv-SE", {timeZone: "Europe/Stockholm"})
    }


    /**
     * Sets the order
     *
     * @param {Order} order - The order
     * @throws {TypeError} - If the type of the parameter is not an instance of Order
     */
    setOrder(order) {
        if(!(order instanceof Order)) {
            throw new TypeError('The order has to be an instance of the class Order in order for the Invoice class to be able to create an invoice')
        }
        this.#order = order
    }

    setName(name) {
        if(name.length <= 0) {
            throw new Error('The name cannot be empty')
        }

        this.#customerName = name
    }


    /**
     * Creates an invoice
     */
    createInvoice() {
        console.log('THIS IS THE INVOICE')
        console.log('Date: ' + this.#date)
        console.log('Name: ' + this.#customerName)

        this.#order.displayProductsInCart().forEach(element => {
            console.log(element.toString())
        })

    }

    #createDoc() {

    }
    
}