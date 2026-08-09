import { test, expect } from '@fixtures/test-fixtures';
import { SAUCE_STORAGE_STATE } from '@config/paths';
import { products, productNames, shipping } from '@data/test-data';

// Reuses the session cached by tests/auth.setup.ts, so this spec starts on the
// inventory page instead of spending a step on the login form.
test.use({ storageState: SAUCE_STORAGE_STATE });

test.describe('Sauce Demo - End to end purchase', () => {
  test(
    'user can add an item and complete checkout',
    { tag: ['@smoke', '@regression'] },
    async ({ inventory, cart, page }) => {
      await test.step('Open the inventory as a signed-in user', async () => {
        await inventory.open();
        await expect(page).toHaveURL(/inventory\.html$/);
        await expect(inventory.inventoryList).toBeVisible();
      });

      await test.step('Add the backpack to the cart', async () => {
        await inventory.addItemToCart(products.backpack);
        await expect(inventory.cartBadge).toHaveText('1');
      });

      await test.step('Open the cart and verify its contents', async () => {
        await inventory.openCart();
        await expect(page).toHaveURL(/cart\.html$/);
        await expect(cart.cartItems).toHaveCount(1);
        await expect(cart.itemByName(productNames.backpack)).toBeVisible();
      });

      await test.step('Enter shipping information', async () => {
        await cart.startCheckout();
        await expect(page).toHaveURL(/checkout-step-one\.html$/);
        await cart.fillShippingInfo(shipping.firstName, shipping.lastName, shipping.postalCode);
      });

      await test.step('Verify the order overview before confirming', async () => {
        await expect(page).toHaveURL(/checkout-step-two\.html$/);
        await expect(cart.itemByName(productNames.backpack)).toBeVisible();
        await expect(cart.itemTotal).toContainText('$29.99');
      });

      await test.step('Finish the order', async () => {
        await cart.finish();
        await expect(page).toHaveURL(/checkout-complete\.html$/);
        await expect(cart.completeHeader).toHaveText('Thank you for your order!');
        await expect(inventory.cartBadge).toBeHidden();
      });
    }
  );
});
