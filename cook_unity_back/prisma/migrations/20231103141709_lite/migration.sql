/*
  Warnings:

  - You are about to drop the `Food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Menu_food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Menu_subscription_food_selection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_intern` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_menu_subscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Menu_food" DROP CONSTRAINT "Menu_food_food_id_fkey";

-- DropForeignKey
ALTER TABLE "Menu_food" DROP CONSTRAINT "Menu_food_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "Menu_subscription_food_selection" DROP CONSTRAINT "Menu_subscription_food_selection_menu_food_id_menu_food_me_fkey";

-- DropForeignKey
ALTER TABLE "Menu_subscription_food_selection" DROP CONSTRAINT "Menu_subscription_food_selection_user_menu_subscription_id_fkey";

-- DropForeignKey
ALTER TABLE "User_intern" DROP CONSTRAINT "User_intern_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "User_menu_subscription" DROP CONSTRAINT "User_menu_subscription_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "User_menu_subscription" DROP CONSTRAINT "User_menu_subscription_user_username_fkey";

-- DropTable
DROP TABLE "Food";

-- DropTable
DROP TABLE "Menu";

-- DropTable
DROP TABLE "Menu_food";

-- DropTable
DROP TABLE "Menu_subscription_food_selection";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "User_intern";

-- DropTable
DROP TABLE "User_menu_subscription";

-- CreateTable
CREATE TABLE "chef" (
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chef_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "meal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chef_username" TEXT NOT NULL,

    CONSTRAINT "meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "username" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "user_meal" (
    "id" SERIAL NOT NULL,
    "user_username" TEXT NOT NULL,
    "meal_id" INTEGER NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "user_meal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "meal" ADD CONSTRAINT "meal_chef_username_fkey" FOREIGN KEY ("chef_username") REFERENCES "chef"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_meal" ADD CONSTRAINT "user_meal_user_username_fkey" FOREIGN KEY ("user_username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_meal" ADD CONSTRAINT "user_meal_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
