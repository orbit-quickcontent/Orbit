 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { NextRequest } from 'next/server';
import { firestoreDb } from './db';
 // Wait, let's verify if user-handlers handles POST user or POST booking. Let's make sure.
// Ah, booking list handlers are in '../client/backend/booking-list-handlers'
import { POST as createBooking } from '../client/backend/booking-list-handlers';
import { POST as dispatchBooking } from '../partner/backend/booking-dispatch-handlers';
import { POST as acceptBooking } from '../partner/backend/booking-accept-handlers';


async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function test() {
  console.log('=== STARTING END-TO-END FLOW TEST ===');

  // 1. Fetch user and package
  const user = await firestoreDb.clientUsers.findFirst({
    where: { email: 'demo@orbitlogic.io' }
  });
  if (!user) throw new Error('Demo user not found');
  console.log(`✓ Found client user: ${user.name} (${user.id})`);

  const pkg = await firestoreDb.packages.findFirst({
    where: { tier: 'PERSONALIZED' }
  });
  if (!pkg) throw new Error('Personalized package not found');
  console.log(`✓ Found package: ${pkg.name} (${pkg.id})`);

  const partnerProfiles = await firestoreDb.partners.findMany();
  const partnerProfile = partnerProfiles[0];
  if (!partnerProfile) throw new Error('No partner found in Firestore');
  const partnerUser = await firestoreDb.partnerUsers.findUnique({
    where: { id: partnerProfile.userId }
  });
  const partner = {
    ...partnerProfile,
    user: partnerUser
  };
  console.log(`✓ Found partner: ${_optionalChain([partner, 'access', _ => _.user, 'optionalAccess', _2 => _2.name])} (${partner.id}) with walletBalance: ${partner.walletBalance}`);

  // Save initial wallet balance
  const initialBalance = partner.walletBalance;

  // 2. Create Booking
  console.log('\n--- Step 1: Create Booking ---');
  const reqBody = {
    userId: user.id,
    packageId: pkg.id,
    bookingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    timeSlot: '12:00 PM',
    location: 'Mumbai, India',
    notes: 'Integration test flow booking'
  };

  const createRequest = new NextRequest('http://localhost:3000/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqBody)
  });

  const createRes = await createBooking(createRequest);
  const createData = await createRes.json();
  if (createRes.status !== 201) {
    throw new Error(`Failed to create booking: ${JSON.stringify(createData)}`);
  }

  const bookingId = createData.booking.id;
  console.log(`✓ Booking created successfully. ID: ${bookingId}, status: ${createData.booking.status}`);

  // 3. Verify Direct PAID/SUCCESS Status
  console.log('\n--- Step 2: Verify Direct Booking Confirmation (PAID status) ---');
  const bookingAfterCreation = await firestoreDb.bookings.findUnique({
    where: { id: bookingId }
  });
  console.log(`✓ Booking status after creation: ${_optionalChain([bookingAfterCreation, 'optionalAccess', _3 => _3.status])}, paymentStatus: ${_optionalChain([bookingAfterCreation, 'optionalAccess', _4 => _4.paymentStatus])}`);
  if (_optionalChain([bookingAfterCreation, 'optionalAccess', _5 => _5.status]) !== 'PAID') {
    throw new Error('Booking status is not PAID');
  }

  // 4. Dispatch Booking
  console.log('\n--- Step 3: Dispatch Booking ---');
  const dispatchRequest = new NextRequest(`http://localhost:3000/api/bookings/${bookingId}/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  const dispatchRes = await dispatchBooking(dispatchRequest, { params: Promise.resolve({ id: bookingId }) });
  const dispatchData = await dispatchRes.json();
  console.log(`✓ Dispatch response: ${JSON.stringify(dispatchData)}`);

  // Verify dispatches created
  const dispatches = await firestoreDb.workDispatches.findMany({
    where: { bookingId }
  });
  console.log(`✓ Number of active work dispatches: ${dispatches.length}`);
  if (dispatches.length === 0) {
    throw new Error('No work dispatches created');
  }

  // 5. Partner Accepts Booking
  console.log('\n--- Step 4: Partner Accepts Booking ---');
  const acceptRequest = new NextRequest(`http://localhost:3000/api/bookings/${bookingId}/accept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ partnerId: partner.id })
  });

  const acceptRes = await acceptBooking(acceptRequest, { params: Promise.resolve({ id: bookingId }) });
  const acceptData = await acceptRes.json();
  if (acceptRes.status !== 200) {
    throw new Error(`Failed to accept booking: ${JSON.stringify(acceptData)}`);
  }
  console.log(`✓ Accept response status: ${acceptRes.status}, assigned partner: ${acceptData.booking.partnerId}, booking status: ${acceptData.booking.status}`);

  // 6. Complete Sync
  console.log('\n--- Step 5: Complete Sync (Upload Footage) ---');
  const syncRequest = new NextRequest(`http://localhost:3000/api/bookings/${bookingId}/sync-complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      footageUrls: ['http://aws-s3-test-bucket/1.mp4', 'http://aws-s3-test-bucket/2.mp4'],
      fileName: '1.mp4',
      fileSize: 5242880
    })
  });

  const syncRes = await fetch(`http://localhost:5000/api/bookings/${bookingId}/sync-complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      footageUrls: ['http://aws-s3-test-bucket/1.mp4', 'http://aws-s3-test-bucket/2.mp4'],
      fileName: '1.mp4',
      fileSize: 5242880
    })
  });
  const syncData = await syncRes.json();
  if (syncRes.status !== 200) {
    throw new Error(`Failed to complete sync: ${JSON.stringify(syncData)}`);
  }
  console.log(`✓ Sync complete response: status = ${syncData.booking.status}, syncPercentage = ${syncData.booking.syncPercentage}`);

  // 7. Verify Partner Wallet Balance
  console.log('\n--- Step 6: Verify Wallet Credit & Earning ---');
  const updatedPartner = await firestoreDb.partners.findUnique({
    where: { id: partner.id }
  });
  if (!updatedPartner) throw new Error('Failed to find partner after test');

  console.log(`✓ Partner wallet balance before: ${initialBalance}`);
  console.log(`✓ Partner wallet balance after: ${updatedPartner.walletBalance}`);

  const diff = updatedPartner.walletBalance - initialBalance;
  console.log(`✓ Difference: ${diff} INR (expected: ${pkg.price} INR)`);

  if (diff !== pkg.price) {
    throw new Error(`Wallet balance difference does not match package price! Got: ${diff}, Expected: ${pkg.price}`);
  }

  // Check transaction list
  const transactions = await firestoreDb.transactions.findMany({
    where: { partnerId: partner.id, bookingId }
  });
  console.log(`✓ Recorded transactions for this booking: ${transactions.length}`);
  transactions.forEach(t => console.log(`- Type: ${t.type}, Amount: ${t.amount}, Status: ${t.status}, Description: ${t.description}`));
  if (transactions.length !== 1) {
    throw new Error('Earning transaction was not created correctly');
  }

  console.log('\n=== E2E FLOW TEST PASSED SUCCESSFULLY! ===');
}

test()
  .catch((e) => {
    console.error('\n❌ TEST FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    // No disconnect needed for Firestore
  });
