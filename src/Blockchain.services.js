import abi from './abis/src/contracts/DappBnb.sol/DappBnb.json';
import address from './abis/contractAddress.json';
import { getGlobalState, setGlobalState } from './store';
import { logOutWithCometChat } from './services/Chat';
import { ethers } from 'ethers';
import { Magic } from 'magic-sdk';
import { Web3 } from 'web3';

const contractAddress = address.address;
const contractAbi = abi.abi;
let tx;

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

const getEtheriumContract = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  return contract;
};

const isWallectConnected = async () => {
    try {

  const isLoggedIn = await magic.user.isLoggedIn();
      const magic = new Magic("pk_live_47057EC7DC7D2202", {  network: 'mainnet'});
      const web3 = new Web3(magicProvider);

      const accounts = await magic.wallet.connectWithUI();


      setGlobalState('connectedAccount', address);
    
  } catch (error) {
    reportError(error);
  }
};

const connectWallet = async () => {
  try {
const magic = new Magic("pk_live_47057EC7DC7D2202", {  network: 'mainnet'});const accounts = await magic.wallet.connectWithUI();

    // Trigger the Magic Link login flow
    await magic.auth.loginWithMagicLink({ email: 'user@example.com' });


      setGlobalState('connectedAccount', address);
  
  } catch (error) {
    reportError(error);
  }
};

// Rest of the code remains the same

const createAppartment = async ({
  name,
  description,
  rooms,
  images,
  price,
}) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    price = toWei(price)
    tx = await contract.createAppartment(
      name,
      description,
      images,
      rooms,
      price,
      {
        from: connectedAccount,
      }
    )
    await tx.wait()
  } catch (err) {
    console.log(err)
  }
}

const updateApartment = async ({
  id,
  name,
  description,
  rooms,
  images,
  price,
}) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    price = toWei(price)
    tx = await contract.updateAppartment(
      id,
      name,
      description,
      images,
      rooms,
      price,
      {
        from: connectedAccount,
      }
    )
    await tx.wait()
    await loadAppartment(id)
  } catch (err) {
    console.log(err)
  }
}

const deleteAppartment = async (id) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    tx = await contract.deleteAppartment(id, { from: connectedAccount })
    await tx.wait()
    await loadAppartments()
  } catch (err) {
    reportError(err)
  }
}

const loadAppartments = async () => {
  try {
    const contract = await getEtheriumContract()
    const appartments = await contract.getApartments()
    const securityFee = await contract.securityFee()
    setGlobalState('appartments', structureAppartments(appartments))
    setGlobalState('securityFee', fromWei(securityFee))
  } catch (err) {
    reportError(err)
  }
}

const loadAppartment = async (id) => {
  try {
    const contract = await getEtheriumContract()
    const appartment = await contract.getApartment(id)
    const booked = await contract.tenantBooked(id)
    setGlobalState('appartment', structureAppartments([appartment])[0])
    setGlobalState('booked', booked)
  } catch (error) {
    reportError(error)
  }
}

const appartmentBooking = async ({ id, datesArray, amount }) => {
  try {
    const contract = await getEtheriumContract()
    const connectedAccount = getGlobalState('connectedAccount')
    const securityFee = getGlobalState('securityFee')

    tx = await contract.bookApartment(id, datesArray, {
      from: connectedAccount,
      value: toWei(Number(amount) + Number(securityFee)),
    })
    await tx.wait()
    await getUnavailableDates(id)
  } catch (err) {
    console.log(err)
  }
}

const refund = async ({ id, bookingId, date }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()

    tx = await contract.refundBooking(id, bookingId, date, {
      from: connectedAccount,
    })

    await tx.wait()
    await getUnavailableDates(id)
  } catch (err) {
    reportError(err)
  }
}

const claimFunds = async ({ id, bookingId }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()

    tx = await contract.claimFunds(id, bookingId, {
      from: connectedAccount,
    })

    await tx.wait()
  } catch (err) {
    reportError
  }
}

const checkInApartment = async (id, bookingId) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    tx = await contract.checkInApartment(id, bookingId, {
      from: connectedAccount,
    })
    await tx.wait()
  } catch (err) {
    reportError(err)
  }
}

const getUnavailableDates = async (id) => {
  const contract = await getEtheriumContract()

  const unavailableDates = await contract.getUnavailableDates(id)
  const timestamps = unavailableDates.map((timestamp) => Number(timestamp))
  setGlobalState('timestamps', timestamps)
}

const hasBookedDateReached = async ({ id, bookingId }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    const result = await contract.hasBookedDateReached(id, bookingId, {
      from: connectedAccount,
    })
    setGlobalState('status', result)
  } catch (err) {
    reportError(err)
  }
}

const getBookings = async (id) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()
    const bookings = await contract.getBookings(id, {
      from: connectedAccount,
    })

    setGlobalState('bookings', structuredBookings(bookings))
  } catch (err) {
    reportError(err)
  }
}

const getBooking = async ({ id, bookingId }) => {
  try {
    const connectedAccount = getGlobalState('connectedAccount')
    const contract = await getEtheriumContract()

    const booking = await contract.getBooking(id, bookingId, {
      from: connectedAccount,
    })
    setGlobalState('bookings', structuredBookings([booking])[0])
  } catch (err) {
    reportError(err)
  }
}

const addReview = async (id, reviewText) => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const contract = await getEtheriumContract()
    tx = await contract.addReview(id, reviewText)
    await tx.wait()

    await loadReviews(id)
  } catch (err) {
    reportError(err)
  }
}

const loadReviews = async (id) => {
  try {
    const contract = await getEtheriumContract()
    const reviews = await contract.getReviews(id)
    setGlobalState('reviews', structuredReviews(reviews))
  } catch (error) {
    console.log(error)
  }
}

const structureAppartments = (appartments) =>
  appartments.map((appartment) => ({
    id: Number(appartment.id),
    name: appartment.name,
    owner: appartment.owner.toLowerCase(),
    description: appartment.description,
    price: parseInt(appartment.price._hex) / 10 ** 18,
    deleted: appartment.deleted,
    images: appartment.images.split(','),
    rooms: Number(appartment.rooms),
    timestamp: new Date(appartment.timestamp * 1000).toDateString(),
    booked: appartment.booked,
  }))

const structuredReviews = (reviews) =>
  reviews.map((review) => ({
    id: review.id.toNumber(),
    appartmentId: review.appartmentId.toNumber(),
    reviewText: review.reviewText,
    owner: review.owner.toLowerCase(),
    timestamp: new Date(review.timestamp * 1000).toDateString(),
  }))

const structuredBookings = (bookings) =>
  bookings.map((booking) => ({
    id: booking.id.toNumber(),
    tenant: booking.tenant.toLowerCase(),
    date: new Date(booking.date.toNumber()).toDateString(),
    price: parseInt(booking.price._hex) / 10 ** 18,
    checked: booking.checked,
    cancelled: booking.cancelled,
  }))

export {
  isWallectConnected,
  connectWallet,
  createAppartment,
  loadAppartments,
  loadAppartment,
  updateApartment,
  deleteAppartment,
  appartmentBooking,
  loadReviews,
  addReview,
  getUnavailableDates,
  getBookings,
  getBooking,
  hasBookedDateReached,
  refund,
  checkInApartment,
  claimFunds,
}
