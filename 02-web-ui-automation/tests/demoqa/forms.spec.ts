import { test, expect } from '@fixtures/test-fixtures';
import { practiceFormData } from '@data/test-data';

test.describe('DemoQA - Practice form', () => {
  // Third-party ad scripts make this site slow to settle even with ads blocked.
  test.slow();

  test(
    'submitted values are echoed back in the confirmation modal',
    { tag: ['@regression', '@flaky-site'] },
    async ({ demoqaForm }) => {
      const data = practiceFormData();

      await demoqaForm.open();
      await demoqaForm.fillAndSubmit(data);

      await expect(demoqaForm.confirmationModal).toBeVisible();
      await expect(demoqaForm.confirmationTitle).toBeVisible();

      // Soft assertions: if one field is echoed back wrong we still want to see
      // the state of all the others in a single run.
      await expect
        .soft(demoqaForm.confirmationValue('Student Name'))
        .toHaveText(`${data.firstName} ${data.lastName}`);
      await expect.soft(demoqaForm.confirmationValue('Student Email')).toHaveText(data.email);
      await expect.soft(demoqaForm.confirmationValue('Gender')).toHaveText('Male');
      await expect.soft(demoqaForm.confirmationValue('Mobile')).toHaveText(data.mobile);
    }
  );
});
