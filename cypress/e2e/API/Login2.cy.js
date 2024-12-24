import {faker} from '@faker-js/faker';
describe('Restful Booker API Automated Testing', ()=>{
    const login = {
        'username': 'admin',
        'password': 'password123',
    }
    let token
    let bookingId;
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    it('Create Token Request', ()=>{
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: login
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            token = response.body.token;
            cy.log('token', token);
        });
    })
    it('Create Booking Request', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            headers: {
                authorization: `Bearer ${token}` // Ensure the token is valid
            },
            body: {
                firstname: firstName,
                lastname: lastName,
                totalprice: 200, // Correct casing
                depositpaid: true, // Correct casing
                bookingdates: { // Correct casing
                    checkin: "2024-03-03",
                    checkout: "2024-03-08"
                },
                additionalneeds: 'Breakfast' // Correct casing
            },
            failOnStatusCode: false // Temporary for debugging
        }).then((response) => {
            cy.log('Status Code:', response.status);
            cy.log('Response Body:', JSON.stringify(response.body));

            expect(response.status).to.eq(200); // Assert success
            expect(response.body.booking).to.have.property('firstname');
            expect(response.body.booking).to.have.property('lastname');
            expect(response.body.booking.firstname).to.eq(firstName);
            expect(response.body.booking.lastname).to.eq(lastName);

            bookingId = response.body.bookingid; // Store the booking ID
            cy.log('bookingId:', bookingId);
        });
    });
    it('Get  Booking Request', () => {
        cy.request({
            method: 'GET',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            headers: {
                authorization: `Bearer ${token}`

            },

        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('firstname');
            expect(response.body).to.have.property('lastname');
            expect(response.body.firstname).to.eq(firstName);
            expect(response.body.lastname).to.eq(lastName);
            expect(response.body).to.have.property("additionalneeds",'Breakfast');
        })
    })
})
