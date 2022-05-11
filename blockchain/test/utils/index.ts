import { assert } from 'chai';

export const expectAnyAsyncError = async (
  promise: Promise<any>
): Promise<void> => {
  try {
    await promise;
  } catch (e) {
    return;
  }
  assert.fail('Error is not thrown');
};

export const promiseTimer = async (delay: number) => {
  return new Promise((r) => {
    setTimeout(r, delay);
  });
};
