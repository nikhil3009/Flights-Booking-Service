/** @format */
const axios = require('axios');

const { BookingRepository } = require('../repositories');
const { ServerConfig } = require('../config');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-error');
const db = require('../models');

async function createBooking(data) {
	return new Promise((resolve, reject) => {
		const result = db.sequelize.transaction(async function bookingImpl(t) {
			const flight = await axios.get(
				`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
			);
			const flightData = flight.data.data;
			if (data.noOfSeats > flightData.totalSeats) {
				reject(
					new AppError(
						'Seats not available as its exceeding the available seats',
						StatusCodes.INTERNAL_SERVER_ERROR
					)
				);
			}
			resolve(true);
		});
	});
}

module.exports = {
	createBooking,
};
