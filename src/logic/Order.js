/**
 * An order
 */

import { Product } from "./Product.js"

export class Order {
    #orderNr
    #isActive = true // Går det att använda enum // Status paid?????? Pending? ⚠️
    #productsInCart

    /**
     * The order number of the order
     * @param {Number} orderNr The order number
     */
    constructor(orderNr) {
        this.#productsInCart = []
        this.setOrderNumber(orderNr)
    }

    /**
     * Sets the order number
     * @param {Number} orderNr - The order number
     */
    setOrderNumber(orderNr) {
        if(orderNr < 0 || !Number.isInteger(orderNr)) {
            throw new Error('The ordernumber is not a valid number. The order number has to be a positive integer')
        }
        this.#orderNr = orderNr
    }

    /**
     * Returns the status of the order
     * @returns {boolean} The status of the order
     */
    isActiveOrder() {
        return this.#isActive
    }

    /**
     * Returns the order number
     *
     * @returns {Number} - Order number
     */
    getOrderNumber() {
        return this.#orderNr
    }

    /**
     * Adds a product to the cart
     *
     * @param {Product} product - The product
     * @param {Number} quantity - Number of producs
     */
    addProduct(product, quantity = 1) {
        if(!(product instanceof Product)) {
            throw TypeError('The product has to be an instance of the class Product')
        }

        for(let i = 0; i < quantity; i++) {
            this.#productsInCart.push(product)
        }
    }

    /**
     * Displays all the products in the order
     *
     * @returns {Array} Returns all of the products in the cart
     */
    displayProductsInCart() {
        return [...this.#productsInCart]
    }

    /**
     * Calculates the total sum of all products in the order
     *
     * @returns {Number} Returns the total sum
     */
    calculateTotalPrice() {
        let totalPrice = 0

        this.#productsInCart.forEach(product => {
            totalPrice+= product.getPrice()
        })

        return totalPrice
    }

    /**
     * Creates the invoice
     * @returns {File} Returns a file with the invoixe
     */
    createInvoice(name) {
        this.setStatus('inactive')
        const invoice = new Invoice(this, name)
        return invoice.createInvoice()
        // TODO: Implement code here
        // Hantera logik för att skapa och rendera en faktura, returnera en fil 
        // Skicka med data som behövs
        /**
         * Namn
         * Telefonnummer
         * Email
         * Produkter
         * Rendera allt
         */
    }


    
}