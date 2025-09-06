DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'OrderStatus') THEN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'CANCELLED');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "User" (
                                      id SERIAL PRIMARY KEY,
                                      "fullName" VARCHAR(255) NOT NULL,
                                      email VARCHAR(255) UNIQUE NOT NULL,
                                      password VARCHAR(255) NOT NULL,
                                      role "UserRole" DEFAULT 'USER',
                    phone VARCHAR(255),
                                      verified TIMESTAMP WITH TIME ZONE,
                                      provider VARCHAR(255),
                                      "providerId" VARCHAR(255),
                                      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'User' AND column_name = 'phone'
  ) THEN
    EXECUTE 'ALTER TABLE "User" ADD COLUMN phone VARCHAR(255)';
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS "Category" (
                                          id SERIAL PRIMARY KEY,
                                          name VARCHAR(255) UNIQUE NOT NULL,
                                          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Product" (
                                         id SERIAL PRIMARY KEY,
                                         name VARCHAR(255) NOT NULL,
                                         "imageUrl" VARCHAR(255) NOT NULL,
                                         "categoryId" INTEGER NOT NULL REFERENCES "Category"(id) ON DELETE RESTRICT,
                                         "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                         "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ProductItem" (
                                             id SERIAL PRIMARY KEY,
                                             price INTEGER NOT NULL,
                                             size INTEGER,
                                             "pizzaType" INTEGER,
                                             "productId" INTEGER NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
                                             "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                             "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Ingredient" (
                                            id SERIAL PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
                                            price INTEGER NOT NULL,
                                            "imageUrl" VARCHAR(255) NOT NULL,
                                            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Cart" (
                                      id SERIAL PRIMARY KEY,
                                      "userId" INTEGER UNIQUE REFERENCES "User"(id) ON DELETE SET NULL,
                                      token VARCHAR(255) NOT NULL,
                                      "totalAmount" INTEGER DEFAULT 0,
                                      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                      "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CartItem" (
                                          id SERIAL PRIMARY KEY,
                                          "cartId" INTEGER NOT NULL REFERENCES "Cart"(id) ON DELETE CASCADE,
                                          "productItemId" INTEGER NOT NULL REFERENCES "ProductItem"(id) ON DELETE CASCADE,
                                          quantity INTEGER DEFAULT 1,
                                          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Order" (
                                       id SERIAL PRIMARY KEY,
                                       "userId" INTEGER REFERENCES "User"(id) ON DELETE SET NULL,
                                       token VARCHAR(255) NOT NULL,
                                       "totalAmount" INTEGER NOT NULL,
                                       status "OrderStatus" NOT NULL,
                                       "paymentId" VARCHAR(255),
                                       items JSONB NOT NULL,
                                       "fullName" VARCHAR(255) NOT NULL,
                                       email VARCHAR(255) NOT NULL,
                                       phone VARCHAR(255) NOT NULL,
                                       address TEXT NOT NULL,
                                       comment TEXT,
                                       "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                       "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Story" (
  "id" SERIAL PRIMARY KEY,
  "previewImageUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "StoryItem" (
  "id" SERIAL PRIMARY KEY,
  "storyId" INTEGER NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "StoryItem_storyId_fkey"
    FOREIGN KEY ("storyId") REFERENCES "Story"("id")
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "VerificationCode" (
                                                  id SERIAL PRIMARY KEY,
                                                  "userId" INTEGER NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
                                                  code VARCHAR(255) NOT NULL,
                                                  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                                  UNIQUE("userId", code)
);

CREATE TABLE IF NOT EXISTS "_IngredientToProduct" (
                                                      "A" INTEGER NOT NULL REFERENCES "Ingredient"(id) ON DELETE CASCADE,
                                                      "B" INTEGER NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
                                                      PRIMARY KEY ("A", "B")
);

CREATE TABLE IF NOT EXISTS "_CartItemToIngredient" (
                                                       "A" INTEGER NOT NULL REFERENCES "CartItem"(id) ON DELETE CASCADE,
                                                       "B" INTEGER NOT NULL REFERENCES "Ingredient"(id) ON DELETE CASCADE,
                                                       PRIMARY KEY ("A", "B")
);

CREATE INDEX IF NOT EXISTS "idx_user_email" ON "User"(email);
CREATE INDEX IF NOT EXISTS "idx_product_category" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "idx_cart_user" ON "Cart"("userId");
CREATE INDEX IF NOT EXISTS "idx_order_user" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "idx_verification_user" ON "VerificationCode"("userId");
CREATE INDEX IF NOT EXISTS "StoryItem_storyId_idx" ON "StoryItem"("storyId");