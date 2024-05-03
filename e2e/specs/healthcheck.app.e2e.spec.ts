describe('Health', () => {
  test('Reservations', async () => {
    const response = await fetch('http://reservations:3005');
    expect(response.ok).toBeTruthy();
  });

  test('Auth', async () => {
    const response = await fetch('http://auth:3010');
    expect(response.ok).toBeTruthy();
  });
});
