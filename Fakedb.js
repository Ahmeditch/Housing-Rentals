const Rental = require('./models/rental');

class Fakedb {
    constructor() {
        this.rentals = [
            {
                title: 'Nice appartement',
                city: 'Sousse',
                street: 'Hammam sousse',
                category: 'Apartement',
                image: 'https://q-cf.bstatic.com/images/hotel/max1024x768/425/42566548.jpg',
                bedrooms: 4,
                description: 'Very nice apartment with a cheap rental price',
                dailyRate: 20
            },
            {
                title: 'Villa sea view',
                city: 'Sousse',
                street: 'Chott mariem',
                category: 'Villa',
                image: 'https://croatia-exclusive.eu/storage/images/13056/main_original/13056.jpg',
                bedrooms: 6,
                description: 'Very nice Villa with a Nice view of chott mariem sea',
                dailyRate: 60
            },
        ]
    }
    async cleanDb() {
       await Rental.deleteMany({});
    }
    pushRentalsToDb() {
        this.rentals.forEach(rental => {
                const newRental = new Rental(rental);
                newRental.save();
        });
    }

    seedDb() {
        this.cleanDb();
        this.pushRentalsToDb();
    }
}

module.exports = Fakedb;