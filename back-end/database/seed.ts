import pool from './db'
import bcrypt from 'bcrypt';

const categories = [
    {name: 'Pizzas'},
    {name: 'Snacks'},
    {name: 'Drinks'},
    {name: 'Desserts'}
];

const ingredients = [
    {name: 'Mozzarella', price: 35, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA62D5D6027'},
    {name: 'Pepperoni', price: 45, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA62D5D6027'},
    {name: 'Mushrooms', price: 25, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA67259A324'},
    {name: 'Tomatoes', price: 20, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA7AC1A1D67'},
    {name: 'Bacon', price: 40, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA637AAB68F'},
    {name: 'Meatballs', price: 50, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/b2f3a5d5afe44516a93cfc0d2ee60088.png'},
    {name: 'Onion', price: 15, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA60AE6464C'},
    {name: 'Cheddar Cheese', price: 25, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA69C1FE796'},
    {name: 'Pickled cucumbers', price: 30, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A21DA51A81211E9EA89958D782B'},
    {name: 'Sweet peppers', price: 40, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA63F774C1B'}
];

const randomPrice = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min) + min);
};

const generateProductItem = (productId: number, pizzaType?: 1 | 2, size?: 20 | 30 | 40) => {
    let basePrice = randomPrice(180, 450); // Base price in CZK

    // Size multiplier
    if (size === 30) basePrice += 50;
    if (size === 40) basePrice += 100;

    // Type multiplier (traditional crust costs more)
    if (pizzaType === 2) basePrice += 30;

    return {
        productId,
        price: basePrice, // Убрать * 100
        pizzaType,
        size
    };
};

async function down() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query('TRUNCATE TABLE "_CartItemToIngredient", "_IngredientToProduct", "VerificationCode", "CartItem", "Cart", "Order", "ProductItem", "Product", "Ingredient", "Category", "User" RESTART IDENTITY CASCADE');

        await client.query('COMMIT');
        console.log('Database cleared successfully');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function up() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Add categories
        const categoryQuery = 'INSERT INTO "Category" (name) VALUES ($1) RETURNING id';
        for (const category of categories) {
            await client.query(categoryQuery, [category.name]);
        }

        // Add ingredients
        const ingredientQuery = 'INSERT INTO "Ingredient" (name, price, "imageUrl") VALUES ($1, $2, $3) RETURNING id';
        for (const ingredient of ingredients) {
            await client.query(ingredientQuery, [ingredient.name, ingredient.price, ingredient.imageUrl]);
        }

        // Add users with hashed passwords
        const hashedPassword1 = await bcrypt.hash('password123', 10);
        const hashedPassword2 = await bcrypt.hash('admin123', 10);

        const userQuery = 'INSERT INTO "User" ("fullName", email, password, role, verified) VALUES ($1, $2, $3, $4, $5) RETURNING id';

        const user1Result = await client.query(userQuery, [
            'John Doe',
            'john@gmail.com',
            hashedPassword1,
            'USER',
            new Date()
        ]);

        const user2Result = await client.query(userQuery, [
            'Admin User',
            'admin@gmail.com',
            hashedPassword2,
            'ADMIN',
            new Date()
        ]);

        // Add pizza products
        const pizzaProducts = [
            {name: 'Margherita Classic', imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D610CF7E265B7C72BE5AE757CA7.avif', categoryId: 1},
            {name: 'Pepperoni Deluxe', imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D612FC7B7FCA5BE822752BEE1E5.avif', categoryId: 1},
            {name: 'Four Cheese Special', imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D61389AB51A8F648A0DBA5B1689.avif', categoryId: 1},
            {name: 'BBQ Chicken Supreme', imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D613B84A5DBB4C1C50FB9583B7E.avif', categoryId: 1},
            {name: 'Vegetarian Garden', imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D610D2925109AB2E1C92CC5383C.avif', categoryId: 1},
            {name: 'Meat Lovers Special', imageUrl: 'https://media.dodostatic.net/image/r:292x292/11EE7D614CBE0530B7234B6D7A6E5F8E.avif', categoryId: 1}
        ];

        // Add snack products
        const snackProducts = [
            {name: 'Crispy French Fries', imageUrl: 'https://media.dodostatic.net/image/r:584x584/019840bab7aa74cd8d4149cd161ba42d.avif', categoryId: 2},
            {name: 'Chicken Wings Hot', imageUrl: 'https://media.dodostatic.net/image/r:584x584/019570d1cf4972f59b57ab333237e745.avif', categoryId: 2},
            {name: 'Chicken Roll', imageUrl: 'https://media.dodostatic.net/image/r:584x584/01980e8a432071ca863e03212730c399.avif', categoryId: 2}
        ];

        // Add drink products
        const drinkProducts = [
            {name: 'Coca Cola Classic', imageUrl: 'https://media.dodostatic.net/image/r:584x584/01980e8d35af7157a519bd92cabda4f7.avif', categoryId: 3},
            {name: 'Orange Juice Fresh', imageUrl: 'https://media.dodostatic.net/image/r:584x584/0197f8636ad574528ad8136969ef6446.avif', categoryId: 3},
            {name: 'Apple Juice', imageUrl: 'https://media.dodostatic.net/image/r:584x584/0197f866677d77d580aa9f99dd242835.avif', categoryId: 3}
        ];

        // Add dessert products
        const dessertProducts = [
            {name: 'Chocolate Cheesecake', imageUrl: 'https://media.dodostatic.net/image/r:584x584/019813870ad07105b599cac0c9b1e04c.avif', categoryId: 4},
            {name: 'Tiramisu Classic', imageUrl: 'https://media.dodostatic.net/image/r:584x584/01980cc3481c78e288c9a989de2dbdc6.avif', categoryId: 4}
        ];

        const allProducts = [...pizzaProducts, ...snackProducts, ...drinkProducts, ...dessertProducts];
        const productQuery = 'INSERT INTO "Product" (name, "imageUrl", "categoryId") VALUES ($1, $2, $3) RETURNING id';
        const productIds = [];

        for (const product of allProducts) {
            const result = await client.query(productQuery, [product.name, product.imageUrl, product.categoryId]);
            productIds.push({id: result.rows[0].id, categoryId: product.categoryId});
        }

        // Add ingredient-product relationships for pizzas
        const ingredientProductQuery = 'INSERT INTO "_IngredientToProduct" ("A", "B") VALUES ($1, $2)';

        const pizzaIngredientMap = [
            [1, 3, 4], // Margherita: Mozzarella, Mushrooms, Tomatoes
            [1, 2, 4], // Pepperoni: Mozzarella, Pepperoni, Tomatoes
            [1, 10, 4], // Four Cheese: Mozzarella, Parmesan, Tomatoes
            [1, 6, 5, 8], // BBQ Chicken: Mozzarella, Chicken, Bacon, Bell Pepper
            [1, 3, 4, 7, 8, 9], // Vegetarian: Mozzarella, Mushrooms, Tomatoes, Onion, Bell Pepper, Olives
            [1, 2, 5, 6] // Meat Lovers: Mozzarella, Pepperoni, Bacon, Chicken
        ];

        // Link pizzas with ingredients
        for (let i = 0; i < 6; i++) {
            const pizzaId = productIds[i].id;
            for (const ingredientId of pizzaIngredientMap[i]) {
                await client.query(ingredientProductQuery, [ingredientId, pizzaId]);
            }
        }

        // Add ProductItems
        const productItemQuery = 'INSERT INTO "ProductItem" (price, size, "pizzaType", "productId") VALUES ($1, $2, $3, $4)';

        // For pizzas - add different sizes and types
        for (let i = 0; i < 6; i++) {
            const pizzaId = productIds[i].id;

            // Small thin crust
            const smallThin = generateProductItem(pizzaId, 1, 20);
            await client.query(productItemQuery, [smallThin.price, 20, 1, pizzaId]);

            // Medium traditional
            const mediumTraditional = generateProductItem(pizzaId, 2, 30);
            await client.query(productItemQuery, [mediumTraditional.price, 30, 2, pizzaId]);

            // Large traditional
            const largeTraditional = generateProductItem(pizzaId, 2, 40);
            await client.query(productItemQuery, [largeTraditional.price, 40, 2, pizzaId]);
        }

        // For non-pizza products - single item without size/type
        for (let i = 6; i < productIds.length; i++) {
            const productId = productIds[i].id;
            let basePrice = 100; // Default price

            if (productIds[i].categoryId === 2) { // Snacks
                basePrice = randomPrice(80, 150);
            } else if (productIds[i].categoryId === 3) { // Drinks
                basePrice = randomPrice(30, 70);
            } else if (productIds[i].categoryId === 4) { // Desserts
                basePrice = randomPrice(90, 180);
            }

            await client.query(productItemQuery, [basePrice, null, null, productId]); // Убрать * 100
        }

        // Add carts
        const cartQuery = 'INSERT INTO "Cart" ("userId", token, "totalAmount") VALUES ($1, $2, $3) RETURNING id';

        const cart1Result = await client.query(cartQuery, [user1Result.rows[0].id, 'user_cart_token_001', 0]);
        await client.query(cartQuery, [user2Result.rows[0].id, 'admin_cart_token_002', 0]);

        // Add cart items
        const cartItemQuery = 'INSERT INTO "CartItem" ("productItemId", "cartId", quantity) VALUES ($1, $2, $3) RETURNING id';

        const cartItemResult = await client.query(cartItemQuery, [1, cart1Result.rows[0].id, 2]);

        // Link cart item with ingredients
        const cartIngredientQuery = 'INSERT INTO "_CartItemToIngredient" ("A", "B") VALUES ($1, $2)';
        for (let i = 1; i <= 3; i++) {
            await client.query(cartIngredientQuery, [cartItemResult.rows[0].id, i]);
        }

        await client.query('COMMIT');
        console.log('Seed data inserted successfully with English names and CZK prices');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function main() {
    try {
        await down();
        await up();
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();