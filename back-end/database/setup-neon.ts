import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Neon database configuration
const neonPool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupNeonDatabase() {
    console.log('🚀 Starting Neon database setup...');

    try {
        // Test connection
        console.log('📡 Testing connection to Neon...');
        const client = await neonPool.connect();
        console.log('✅ Successfully connected to Neon database!');

        // Read and execute schema
        console.log('📋 Creating database schema...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSQL);
        console.log('✅ Database schema created successfully!');

        client.release();

        // Run seed data using the same approach as the original seed file
        console.log('🌱 Seeding database with initial data...');
        await seedNeonDatabase();
        console.log('✅ Database seeded successfully!');

        console.log('🎉 Neon database setup completed!');
        console.log('');
        console.log('🔗 Your database is ready for Vercel deployment!');
        console.log('Add these environment variables to Vercel:');
        console.log('DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT');

    } catch (error) {
        console.error('❌ Error setting up Neon database:', error);
        console.log('');
        console.log('💡 Make sure you have set NEON_DATABASE_URL in your .env file');
        console.log('Example: NEON_DATABASE_URL=postgresql://username:password@host/dbname?sslmode=require');
    } finally {
        await neonPool.end();
    }
}

async function seedNeonDatabase() {
    // Instead of importing seed.ts, we'll execute the seed logic directly using the Neon pool
    // This avoids import issues and ensures we use the correct database connection

    const client = await neonPool.connect();

    try {
        await client.query('BEGIN');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await client.query('TRUNCATE TABLE "_CartItemToIngredient", "_IngredientToProduct", "VerificationCode", "CartItem", "Cart", "Order", "StoryItem", "Story", "ProductItem", "Product", "Ingredient", "Category", "User" RESTART IDENTITY CASCADE');

        // Insert seed data (we'll import the data arrays and logic from seed.ts)
        console.log('📦 Inserting categories...');

        // Categories
        const categories = [
            { name: 'Pizzas' },
            { name: 'Snacks' },
            { name: 'Drinks' },
            { name: 'Desserts' }
        ];

        const categoryInsertQuery = 'INSERT INTO "Category" (name) VALUES ($1) RETURNING id';
        const categoryIds: number[] = [];
        for (const category of categories) {
            const result = await client.query(categoryInsertQuery, [category.name]);
            categoryIds.push(result.rows[0].id);
        }

        console.log('🧄 Inserting ingredients...');

        // Ingredients
        const ingredients = [
            { name: 'Mozzarella', price: 35, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA62D5D6027' },
            { name: 'Pepperoni', price: 45, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA62D5D6027' },
            { name: 'Mushrooms', price: 25, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA67259A324' },
            { name: 'Tomatoes', price: 20, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA7AC1A1D67' },
            { name: 'Bacon', price: 40, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A39D824A82E11E9AFA637AAB68F' },
            { name: 'Meatballs', price: 50, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/b2f3a5d5afe44516a93cfc0d2ee60088.png' },
            { name: 'Onion', price: 15, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA60AE6464C' },
            { name: 'Cheddar Cheese', price: 25, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA69C1FE796' },
            { name: 'Pickled cucumbers', price: 30, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A21DA51A81211E9EA89958D782B' },
            { name: 'Sweet peppers', price: 40, imageUrl: 'https://cdn.dodostatic.net/static/Img/Ingredients/000D3A22FA54A81411E9AFA63F774C1B' }
        ];

        const ingredientInsertQuery = 'INSERT INTO "Ingredient" (name, price, "imageUrl") VALUES ($1, $2, $3) RETURNING id';
        const ingredientIds: number[] = [];
        for (const ingredient of ingredients) {
            const result = await client.query(ingredientInsertQuery, [ingredient.name, ingredient.price, ingredient.imageUrl]);
            ingredientIds.push(result.rows[0].id);
        }

        console.log('🍕 Inserting products...');

        // Products (pizzas)
        const pizzas = [
            { name: 'Margherita', imageUrl: 'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp', categoryId: categoryIds[0] },
            { name: 'Pepperoni', imageUrl: 'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp', categoryId: categoryIds[0] },
            { name: 'Hawaiian', imageUrl: 'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp', categoryId: categoryIds[0] },
            { name: 'Meat Lovers', imageUrl: 'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp', categoryId: categoryIds[0] },
            { name: 'Veggie Supreme', imageUrl: 'https://media.dodostatic.net/image/r:584x584/11EE7D61706D472F9A5D71EB94149304.webp', categoryId: categoryIds[0] }
        ];

        const productInsertQuery = 'INSERT INTO "Product" (name, "imageUrl", "categoryId") VALUES ($1, $2, $3) RETURNING id';
        const productIds: number[] = [];
        for (const pizza of pizzas) {
            const result = await client.query(productInsertQuery, [pizza.name, pizza.imageUrl, pizza.categoryId]);
            productIds.push(result.rows[0].id);
        }

        console.log('📏 Creating product items (sizes and types)...');

        // Product items (different sizes and types)
        const productItemInsertQuery = 'INSERT INTO "ProductItem" ("productId", price, "pizzaType", size) VALUES ($1, $2, $3, $4)';
        const sizes = [20, 30, 40];
        const types = [1, 2]; // 1 = thin, 2 = traditional

        for (const productId of productIds) {
            for (const size of sizes) {
                for (const type of types) {
                    let basePrice = Math.floor(Math.random() * (450 - 180) + 180);
                    if (size === 30) basePrice += 50;
                    if (size === 40) basePrice += 100;
                    if (type === 2) basePrice += 30;

                    await client.query(productItemInsertQuery, [productId, basePrice, type, size]);
                }
            }
        }

        // Link products with ingredients
        console.log('🔗 Linking products with ingredients...');
        const linkQuery = 'INSERT INTO "_IngredientToProduct" ("A", "B") VALUES ($1, $2)';
        for (const productId of productIds) {
            // Each pizza gets some random ingredients
            const numIngredients = Math.floor(Math.random() * 4) + 2; // 2-5 ingredients per pizza
            const selectedIngredients = ingredientIds.slice(0, numIngredients);

            for (const ingredientId of selectedIngredients) {
                await client.query(linkQuery, [ingredientId, productId]);
            }
        }

        await client.query('COMMIT');
        console.log('✅ Seed data inserted successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Run setup if called directly
if (require.main === module) {
    setupNeonDatabase();
}

export default setupNeonDatabase;
