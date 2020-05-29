const table = document.querySelector('#table');
$('#table').DataTable({
  "language": {
    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
  }
});

const showMediationModal = document.querySelector('#viewModal');
const actionShow = document.querySelectorAll('.action-show');


const status = document.querySelector('input[name=status]');
const ad = document.querySelector('input[name=ad]');
const pendingTokens = document.querySelector('input[name=pendingTokens]');
const seller = document.querySelector('input[name=seller]');
const buyer = document.querySelector('input[name=buyer]');
const buyerMessage = document.querySelector('#buyerMessage');

actionShow.forEach(show => {
  show.addEventListener('click', async function () {
    const id = this.getAttribute('data-id');
    const {data: {mediation}} = await axios.get(`/admin/mediations/${id}`);

    status.value = mediation.status ? mediation.status : '';
    ad.value = mediation.appointment.ad.name ? mediation.appointment.ad.name : '';
    pendingTokens.value = mediation.appointment.pendingTokens ? mediation.appointment.pendingTokens : '';
    seller.value = mediation.appointment.seller.name ? mediation.appointment.seller.name : '';
    buyer.value = mediation.appointment.buyer.name ? mediation.appointment.buyer.name : '';
    buyerMessage.innerHTML = mediation.buyerMessage ? mediation.buyerMessage : '';

    $(showMediationModal).modal('show');
  });
});

const resolveMediationModal = document.querySelector('#resolveModal');
const actionResolve = document.querySelectorAll('.action-resolve');
const formResolve = document.querySelector('#resolveModalForm');

const buyerSerkens = document.querySelector('#resolveModal .buyer span');
const sellerSerkens = document.querySelector('#resolveModal .seller span');
const serkensRange = document.querySelector('#resolveModal input[type=range]');
actionResolve.forEach(resolve => {
  resolve.addEventListener('click', async function () {
    const id = this.getAttribute('data-id');
    const pendingTokens = this.getAttribute('data-pendingTokens');
    formResolve.action = `/admin/mediations/${id}/resolve`;
    formResolve.method = 'POST';
    serkensRange.max = parseInt(pendingTokens);
    serkensRange.value = parseInt(pendingTokens);
    sellerSerkens.innerHTML = pendingTokens;

    $(resolveMediationModal).modal('show');
  });
});

serkensRange.addEventListener('input', function () {
  sellerSerkens.innerHTML = this.value;
  buyerSerkens.innerHTML = this.max - this.value;
});