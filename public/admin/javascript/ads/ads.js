const table = document.querySelector('#table');
$('#table').DataTable({
  "language": {
    "url": "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
  }
});

const editAdModal = document.querySelector('#editAdModal');
const actionEdit = document.querySelectorAll('.action-edit');
const editForm = document.querySelector('#editForm');

const owner = document.querySelector('select[name=owner]');
const name = document.querySelector('input[name=name]');
const description = document.querySelector('textarea[name=description]');
const address = document.querySelector('input[name=address]');
const number = document.querySelector('input[name=number]');
const postalCode = document.querySelector('input[name=postalCode]');
const price = document.querySelector('input[name=price]');
const category = document.querySelector('select[name=category]');
const deleted_at = document.querySelector('select[name=deleted_at]');

actionEdit.forEach(edit => {
  edit.addEventListener('click', async function () {
    const id = this.getAttribute('data-id');
    const {data: {ad}} = await axios.get(`/admin/ads/${id}`);

    editForm.action = `/admin/ads/${id}`;
    editForm.method = 'POST';
    owner.value = ad.owner ? ad.owner : '';
    name.value = ad.name ? ad.name : '';
    description.value = ad.description ? ad.description : '' ;
    address.value = ad.address ? ad.address : '' ;
    number.value = ad.number ? ad.number : '';
    postalCode.value = ad.postalCode ? ad.postalCode : '';
    price.value = ad.price ? ad.price : 0;
    category.value = ad.category ? ad.category : '';
    deleted_at.value = ad.deleted_at ? 1 : 0;
    $(editAdModal).modal('show');
  });
});