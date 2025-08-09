const Cart = require('../../models/Cart');
const Product = require('../../models/Product');
const { ValidationError, NotFoundError } = require('../../utils/customErrors');

class CartService {
    async getOrCreateCart(userId) {
        let cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name images price stock.quantity status brand'
            });

        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        // Filter out inactive products or out of stock items
        const validStatuses = ['active', 'Active', 'available', 'Available', 'published', 'Published'];
        const validItems = cart.items.filter(item => 
            item.product && 
            validStatuses.includes(item.product.status) && 
            (!item.product.stock?.trackStock || item.product.stock.quantity > 0)
        );

        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        return cart;
    }

    async addToCart(userId, productId, quantity = 1) {
        if (quantity < 1) {
            throw new ValidationError('Quantity must be at least 1');
        }

        // Check if product exists and is available
        const product = await Product.findById(productId);
        if (!product) {
            throw new NotFoundError('Product not found');
        }

        console.log('Product status:', product.status);
        const validStatuses = ['active', 'Active', 'available', 'Available', 'published', 'Published'];
        if (!validStatuses.includes(product.status)) {
            throw new ValidationError('Product is not available');
        }

        if (product.stock?.trackStock && product.stock.quantity < quantity) {
            throw new ValidationError(`Only ${product.stock.quantity} items available in stock`);
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            
            if (product.stock?.trackStock && product.stock.quantity < newQuantity) {
                throw new ValidationError(`Only ${product.stock.quantity} items available in stock`);
            }
            
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'name images coverImage price stock.quantity status brand'
        });

        return cart;
    }

    async updateCartItem(userId, productId, quantity) {
        if (quantity < 1) {
            throw new ValidationError('Quantity must be at least 1');
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new NotFoundError('Cart not found');
        }

        const itemIndex = cart.items.findIndex(item => 
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            throw new NotFoundError('Item not found in cart');
        }

        // Check stock availability
        const product = await Product.findById(productId);
        if (product.stock?.trackStock && product.stock.quantity < quantity) {
            throw new ValidationError(`Only ${product.stock.quantity} items available in stock`);
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price; // Update price in case it changed

        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'name images coverImage price stock.quantity status brand'
        });

        return cart;
    }

    async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new NotFoundError('Cart not found');
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'name images coverImage price stock.quantity status brand'
        });

        return cart;
    }

    async clearCart(userId) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new NotFoundError('Cart not found');
        }

        cart.items = [];
        await cart.save();

        return cart;
    }

    async getCartSummary(userId) {
        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name price'
            });

        if (!cart) {
            return {
                totalItems: 0,
                totalAmount: 0,
                itemCount: 0
            };
        }

        return {
            totalItems: cart.totalItems,
            totalAmount: cart.totalAmount,
            itemCount: cart.items.length
        };
    }

    async syncCartPrices(userId) {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new NotFoundError('Cart not found');
        }

        let updated = false;

        for (let item of cart.items) {
            const product = await Product.findById(item.product);
            if (product && item.price !== product.price) {
                item.price = product.price;
                updated = true;
            }
        }

        if (updated) {
            await cart.save();
        }

        await cart.populate({
            path: 'items.product',
            select: 'name images coverImage price stock.quantity status brand'
        });

        return { cart, updated };
    }

    async validateCartItems(userId) {
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product');

        if (!cart) {
            return { valid: true, issues: [] };
        }

        const issues = [];
        const validItems = [];

        for (const item of cart.items) {
            if (!item.product) {
                issues.push(`Product no longer exists`);
                continue;
            }

            if (item.product.status !== 'active') {
                issues.push(`${item.product.name} is no longer available`);
                continue;
            }

            if (item.product.stock.trackStock && item.product.stock.quantity < item.quantity) {
                issues.push(`Only ${item.product.stock.quantity} of ${item.product.name} available`);
                item.quantity = item.product.stock.quantity;
            }

            validItems.push(item);
        }

        if (issues.length > 0) {
            cart.items = validItems;
            await cart.save();
        }

        return {
            valid: issues.length === 0,
            issues,
            cart
        };
    }

    async migrateGuestCart(userId, guestCartItems) {
        // Get or create user cart
        let userCart = await Cart.findOne({ user: userId });
        if (!userCart) {
            userCart = new Cart({ user: userId, items: [] });
        }

        // Process each guest cart item
        for (const guestItem of guestCartItems) {
            try {
                // Verify product exists and is available
                const product = await Product.findById(guestItem.productId);
                if (!product || product.status !== 'active') {
                    continue; // Skip invalid products
                }

                // Check if item already exists in user cart
                const existingItemIndex = userCart.items.findIndex(item => 
                    item.product.toString() === guestItem.productId
                );

                if (existingItemIndex > -1) {
                    // Update existing item quantity
                    const newQuantity = userCart.items[existingItemIndex].quantity + guestItem.quantity;
                    const maxQuantity = product.stock.trackStock ? product.stock.quantity : newQuantity;
                    userCart.items[existingItemIndex].quantity = Math.min(newQuantity, maxQuantity);
                    userCart.items[existingItemIndex].price = product.price; // Update to current price
                } else {
                    // Add new item to cart
                    const maxQuantity = product.stock.trackStock ? 
                        Math.min(guestItem.quantity, product.stock.quantity) : 
                        guestItem.quantity;
                    
                    if (maxQuantity > 0) {
                        userCart.items.push({
                            product: guestItem.productId,
                            quantity: maxQuantity,
                            price: product.price
                        });
                    }
                }
            } catch (error) {
                console.error('Error migrating cart item:', error);
                // Continue with other items
            }
        }

        await userCart.save();
        await userCart.populate({
            path: 'items.product',
            select: 'name images coverImage price stock.quantity status brand'
        });

        return userCart;
    }
}

module.exports = new CartService();