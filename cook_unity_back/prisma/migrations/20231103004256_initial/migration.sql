-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu_food" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "food_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Menu_food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu_subscription_food_selection" (
    "id" SERIAL NOT NULL,
    "user_menu_subscription_id" INTEGER NOT NULL,
    "menu_food_id" INTEGER NOT NULL,
    "menu_food_menu_id" INTEGER NOT NULL,
    "menu_food_food_id" INTEGER NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "Menu_subscription_food_selection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_logged_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "User_intern" (
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_logged_at" TIMESTAMP(3),
    "menu_id" INTEGER,

    CONSTRAINT "User_intern_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "User_menu_subscription" (
    "id" SERIAL NOT NULL,
    "user_username" TEXT NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "User_menu_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_food_id_menu_id_food_id_key" ON "Menu_food"("id", "menu_id", "food_id");

-- AddForeignKey
ALTER TABLE "Menu_food" ADD CONSTRAINT "Menu_food_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_food" ADD CONSTRAINT "Menu_food_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_subscription_food_selection" ADD CONSTRAINT "Menu_subscription_food_selection_user_menu_subscription_id_fkey" FOREIGN KEY ("user_menu_subscription_id") REFERENCES "User_menu_subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu_subscription_food_selection" ADD CONSTRAINT "Menu_subscription_food_selection_menu_food_id_menu_food_me_fkey" FOREIGN KEY ("menu_food_id", "menu_food_menu_id", "menu_food_food_id") REFERENCES "Menu_food"("id", "menu_id", "food_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_intern" ADD CONSTRAINT "User_intern_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_menu_subscription" ADD CONSTRAINT "User_menu_subscription_user_username_fkey" FOREIGN KEY ("user_username") REFERENCES "User"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_menu_subscription" ADD CONSTRAINT "User_menu_subscription_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
