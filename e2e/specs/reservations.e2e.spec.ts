describe('Reservations', () => {
  let jwt: string;
  beforeAll(async () => {
    const user = {
      email: 'hoamx.work@gmail.com',
      password: 'randomstrongPassw@00',
    };
    await fetch('http://auth:3010/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await fetch('http://auth:3010/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    jwt = await response.text();
  });
  test('Create && Get', async () => {
    const createdReservation = await createReservation();
    const responseGet = await fetch(
      `http://reservations:3005/reservations/${createdReservation._id}`,
      {
        headers: {
          Authentication: jwt,
        },
      },
    );

    const reservation = await responseGet.json();

    expect(createdReservation).toEqual(reservation);
  });

  const createReservation = async () => {
    const responseCreate = await fetch(
      'http://reservations:3005/reservations',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authentication: jwt,
        },
        body: JSON.stringify({
          start_date: 123,
          end_date: '12-29-2023',
          invoice_id: '123',
          place_id: '23897498',
          charge: {
            amount: 5,
            card: {
              cvc: '413',
              exp_month: 12,
              exp_year: 2027,
              number: '4242 4242 4242 4242',
            },
          },
        }),
      },
    );

    expect(responseCreate.ok).toBeTruthy();

    return responseCreate.json();
  };
});
