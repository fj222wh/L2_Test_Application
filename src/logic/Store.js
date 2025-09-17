/**
 * The store.
 */

import { Order } from "./Order.js"
import { Product } from "./Product.js"
import { ProductCatalog } from "./ProductCatalog.js"

export class Store {
    /**
     * @type {String} - The name
     */
    #name

    /**
     * @type {Array} - All products
     */
    #productCatalog

    /**
     * @type {Array} - All orders
     */
    #orders

    /**
     * @type {Number} - Counting orders
     */
    #orderNumberCounter = 0
    

    /**
     * The constructor for the class Store
     * @param {String} name - The name
     */
    constructor(name) {
        this.setName(name)
        this.#productCatalog = new ProductCatalog() // ⚠️ OSÄKER? SKA DEN LIGGA HÄR ELLER SKA DEN KUNNA SKAPAS UTANFÖR???? ⚠️
        this.#orders = []
    }

    /**
     * Sets the name
     *
     * @param {String} name - name
     */
    setName(name) {
        if(name.length <= 0) {
            throw new Error('The name cannot be empty')
        }

        this.#name = name
    }

    /**
     * Displays all the products in the catalog
     *
     * @returns {Array} Returns an array with all products
     */
    displayProducts() {
        return this.#productCatalog.displayAllProducts()
    }

    /**
     * Adds a product to the catalog
     *
     * @param {Product} product A product
     */
    addProductToCatalog(product) {
        this.#productCatalog.addProduct(product)
    }

    /**
     * Adds an order
     *
     * @returns {Order} The order that has been created
     */
    addOrder() {
        // Should the Store create the Order here???? Or should it be loose and only add it to the array?
        this.#orderNumberCounter++
        const order = new Order(this.#orderNumberCounter)

        // Controll that we only take instances of Order
        this.#orders.push(order)

        return order
    }

    /**
     * Cancels the order and removes it from the array of all orders
     */
    cancelOrder(orderId) {
        // TODO: Cancel an order, delete it!!! 
        // Find the order

    }

    /**
     * Sorts and returns only the active orders
     *
     * @returns {Array} Returns an array with the active orders
     */
    activeOrders() {
        const activeOrders = [...this.displayAllOrders()].filter(order => {
            return order.isActiveOrder() === true
        })

        return activeOrders
    }

    /**
     * View all orders
     *
     * @returns {Array} Returns all orders
     */
    displayAllOrders() {
        return [...this.#orders]
    }
}

