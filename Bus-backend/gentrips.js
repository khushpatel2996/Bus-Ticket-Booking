
const mysql = require("mysql2/promise");
const moment = require("moment");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bansari#611",
  database: "BOOKING",
});

// ---------------- PRICE GENERATOR -----------------
function calculatePrice(distanceKm, busName, depTime) {
  let ratePerKm;

  if (distanceKm < 60) ratePerKm = 5.5;
  else if (distanceKm < 120) ratePerKm = 4.5;
  else if (distanceKm < 200) ratePerKm = 4.2;
  else ratePerKm = 3.8;

  let operator = 1.0;
  if (busName.toLowerCase().includes("expressline")) operator = 1.10;
  else if (busName.toLowerCase().includes("express")) operator = 1.15;
  else if (busName.toLowerCase().includes("travels")) operator = 1.18;
  else if (busName.toLowerCase().includes("rapid")) operator = 1.12;
  else if (busName.toLowerCase().includes("gsrtc")) operator = 1.05;

  const hour = parseInt(depTime.split(":")[0]);
  let night = (hour >= 21 || hour <= 5) ? 1.15 : 1.0;

  const weekday = moment().day();
  let weekend = (weekday === 5 || weekday === 6 || weekday === 0) ? 1.10 : 1.0;

  const seasonal = 1 + (Math.random() * 0.25 - 0.10);
  const random = 1 + (Math.random() * 0.15 - 0.05);

  const price =
    distanceKm *
    ratePerKm *
    operator *
    night *
    weekend *
    seasonal *
    random;

  return Math.round(price);
}

// Trip duration = 1 min per km
function durationMinutes(distanceKm) {
  return Math.round(distanceKm);
}

// Random departure times
function randomTime() {
  const hours = ["05", "06", "07", "08", "09", "11", "13", "15", "17", "19", "21", "23"];
  const mins = ["00", "15", "30", "45"];
  return `${hours[Math.floor(Math.random() * hours.length)]}:${mins[Math.floor(Math.random() * mins.length)]}:00`;
}

// -------- POPULARITY BASED TRIP COUNT --------
function tripsPerDay(fromCity, toCity) {
  const popular = [
    ["Ahmedabad", "Gandhinagar"],
    ["Ahmedabad", "Vadodara"],
    ["Ahmedabad", "Surat"],
    ["Ahmedabad", "Rajkot"],
    ["Surat", "Vadodara"],
    ["Surat", "Navsari"],
    ["Rajkot", "Junagadh"],
  ];

  const medium = [
    ["Ahmedabad", "Anand"],
    ["Ahmedabad", "Nadiad"],
    ["Ahmedabad", "Bhavnagar"],
    ["Ahmedabad", "Patan"],
    ["Vadodara", "Bhavnagar"],
    ["Jamnagar", "Dwarka"],
    ["Mehsana", "Ahmedabad"],
  ];

  // Popular → 10 trips/day
  if (popular.some(r => r[0] === fromCity && r[1] === toCity)) return 10;

  // Medium → 8 trips/day
  if (medium.some(r => r[0] === fromCity && r[1] === toCity)) return 8;

  // Small → 7 trips/day
  return 7;
}

async function generate() {
  const conn = await pool.getConnection();

  try {
    // Fetch all routes and buses
    const [routes] = await conn.query(`SELECT ID, \`From\`, \`To\`, DISTANCE_KM FROM ROUTES`);
    const [buses] = await conn.query(`SELECT ID, NAME FROM BUSES`);

    console.log(`Found ${routes.length} routes and ${buses.length} buses`);

    // Clear all old trip data safely
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("DELETE FROM BOOKING_SEATS");
    await conn.query("DELETE FROM BOOKING");
    await conn.query("DELETE FROM TRIPS");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    await conn.beginTransaction();

    // Generate trips for 365 days
    for (let day = 0; day < 365; day++) {
      const tripDate = moment().add(day, "days").format("YYYY-MM-DD");

      for (const route of routes) {
        const totalTripsToday = tripsPerDay(route.From, route.To);

        for (let i = 0; i < totalTripsToday; i++) {
          const bus = buses[Math.floor(Math.random() * buses.length)];
          const depTime = randomTime();

          const departureDT = `${tripDate} ${depTime}`;
          const arrivalDT = moment(departureDT)
            .add(durationMinutes(route.DISTANCE_KM), "minutes")
            .format("YYYY-MM-DD HH:mm:ss");

          const price = calculatePrice(route.DISTANCE_KM, bus.NAME, depTime);

          await conn.query(
            `INSERT INTO TRIPS (BUS_ID, ROUTE_ID, DEPARTURE_DATETIME, ARRIVAL_DATETIME, PRICE)
             VALUES (?, ?, ?, ?, ?)`,
            [
              bus.ID,
              route.ID,
              moment(departureDT).format("YYYY-MM-DD HH:mm:ss"),
              arrivalDT,
              price,
            ]
          );

          console.log(
            `Trip Added | ${tripDate} | Bus: ${bus.NAME} | ${route.From} → ${route.To} | Price ₹${price}`
          );
        }
      }
    }

    await conn.commit();
    console.log("\n🔥 365 DAYS OF TRIPS GENERATED SUCCESSFULLY WITH 7–10 DAILY TRIPS PER ROUTE! ✔");

  } catch (err) {
    await conn.rollback();
    console.error("❌ ERROR:", err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

generate();
